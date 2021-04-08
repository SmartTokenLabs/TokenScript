package main

import (
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/beevik/etree"
	dsig "github.com/russellhaering/goxmldsig"
)

func main() {
	// Generate a key and self-signed certificate for signing
	randomKeyStore := dsig.RandomKeyStoreForTest()
	ctx := dsig.NewDefaultSigningContext(randomKeyStore)
	elementToSign := &etree.Element{
		Tag: "ExampleElement",
	}
	elementToSign.CreateAttr("ID", "id1234")

	// Sign the element
	signedElement, err := ctx.SignEnveloped(elementToSign)
	if err != nil {
		panic(err)
	}

	// Serialize the signed element. It is important not to modify the element
	// after it has been signed - even pretty-printing the XML will invalidate
	// the signature.
	doc := etree.NewDocument()
	doc.SetRoot(signedElement)
	str, err := doc.WriteToString()
	if err != nil {
		panic(err)
	}

	println(str)

	cf, e := ioutil.ReadFile("ExampleElement.crt")
	if e != nil {
		fmt.Println("cfload:", e.Error())
		os.Exit(1)
	}
	//fmt.Println(string(cf))
	cpb, cr := pem.Decode(cf)
	fmt.Println(string(cr))
	fmt.Println(string(cpb.Type))
	cert, err := x509.ParseCertificate(cpb.Bytes)
	if err != nil {
		fmt.Println("x509.ParseCertificate:", e.Error())
		os.Exit(1)
	}
	fmt.Println(cert.PublicKeyAlgorithm)

	doc2 := etree.NewDocument()
	errdoc := doc2.ReadFromFile("ExampleElement.xml")
	if errdoc != nil {
		panic(errdoc)
	}
	root := doc2.SelectElements("ExampleElement")
	fmt.Println(root[0].Tag)
	validate(cert, root[0])
}

// Validate an element against a root certificate
func validate(root *x509.Certificate, el *etree.Element) {
	// Construct a signing context with one or more roots of trust.
	ctx := dsig.NewDefaultValidationContext(&dsig.MemoryX509CertificateStore{
		Roots: []*x509.Certificate{root},
	})

	// It is important to only use the returned validated element.
	// See: https://www.w3.org/TR/xmldsig-bestpractices/#check-what-is-signed
	validated, err := ctx.Validate(el)
	if err != nil {
		panic(err)
	}

	doc := etree.NewDocument()
	doc.SetRoot(validated)
	str, err := doc.WriteToString()
	if err != nil {
		panic(err)
	}

	println(str)
}
