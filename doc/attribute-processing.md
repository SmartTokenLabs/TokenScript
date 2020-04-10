# Token Attributes

A. I describe how to think of attributes and their origins and mappings as a pipeline below. A useful case to think through is a function origin which returns a GeneralisedTime (so we set as="utf8"), but the attribute syntax is GeneralisedTime (and hence the JavaScript object is expected to be our standard JavaScript GeneralisedTime class).

B. Based on this, it would be good if we add as="address". The matching syntax type should be IA5 String (but Directory String will work too). We can return the JavaScript object as a string or if there's a suitable syntax that defines it as an address, we can create a simple class to wrap it (in the future?)

C. To preserve precision, Numeric Strings are stored internally as a Big Integer, but returned as a JavaScript string (unless we want to support provide or endorse a big number library. Possibly later?)

D. Note that according to https://tools.ietf.org/html/rfc4517#section-3.3.23, Numeric String is:

```
NumericString = 1*(DIGIT / SPACE)
DIGIT   = %x30 / LDIGIT       ; "0"-"9"
LDIGIT  = %x31-39             ; "1"-"9"
```

Attribute as a pipeline:

One way to look at an attribute type and their origin, and (optional) mapping is as a pipeline of 2 or 3 processing stages.

With a mapping:

```
                           A. Origin output with                                           
                          specific type (based on                                          
  Inputs with                      "as").                                       Attribute  
    specific             B. Convert to string to be                             value with 
     types                used as mapping's input                                specific  
  ─────────────▶ ┌──────────┐             ┌──────────┐           ┌──────────┐      type    
                 │  Origin  │───────────▶ │ Mapping  │──────────▶│  Syntax  │─────────▶    
  ─────────────▶ └──────────┘             └──────────┘           └──────────┘              

                                                   Mapping output is                       
                                                   always a string.                        


```


Without mappings:

```
Inputs with           Origin output with specific       Attribute                          
  specific                type (based on "as")          value with                         
   types                                                 specific                          
─────────────▶ ┌──────────┐              ┌──────────┐      type                            
               │  Origin  │───────────▶  │  Syntax  │─────────▶                            
─────────────▶ └──────────┘              └──────────┘                                      



```

1. Each stage has 0 or 1 input (or in the case of function origins, 0 or more inputs) and 1 output

2. All input and output are typed.

3. Ethereum function origins

    1. A ethereum function origin's input types are already specified as Solidity types, eg. `<ts:address>`
    2. Ethereum function origin's output type are specified with `as`, with each possible value mapping to exactly 1 Solidity type. Specifically:

        * as="uint" => uint256
        * as="int" => int256
        * as="utf8" => string
        * as="e18" => uint256
        * as="bool" => bool

    This type mapping is used to interpret (and validate) the smart contract function call return value.

4. User entry origin's output type is specified with `as`, eg. as="e18" and as="uint8"

5. Token ID-based origins' output type is specified with `as` similarly to user entry origins

6. Similar to ethereum function origins, user entry and token ID-based origins should use the `as` value to interpret the output

7. Mappings

    1. Mappings always have string as the input type and output type
    2. The output from the origin is converted to a string which is used as the key for the mapping
    3. The output value is obtained, as a string

8. Syntax

    1. The syntax stage takes the output from the mapping (which is typed string), if there is one.
    2. The syntax stage takes the output from the origin, with a specific type in the absence of a mapping, as its input
    3. The syntax stage converts the input to the output with a type based on the syntax:

        * Directory String, IA5 String => "string" (and JavaScript string)
        * Generalised Time => GeneralisedTime internally (and our standard Javascript GeneralisedTime type)
        * Integer => Big Integer internally (and JavaScript number)
        * Boolean => bool internally (and Javascript bool)
        * Numeric String => Big Integer internally (and JavaScript string)

9. This brings some consistency so we can expand the pipeline to more than 3 stages in the future

10. This is also useful when we have multiple origins which different types within the same attribute type

11. In `<ts:transaction>`, I just assume the function is an origin with as="void" (void is only used internally for consistency), so the output (if any) is dropped. In the future if we need to chain function calls (I don't know if we will ever need to), then it's just another pipeline of function origins with non-void as=""

12. Note while we say the input and output types are typed, TokenScript clients can still hold them internally as strings as long as it knows and can enforce the types they represent. That's an implementation detail. But such a case (assuming `getStreet()` returns a string) should not be permitted:

```
    <ts:origins>
      <ts:ethereum contract="EntryToken" function="getStreet" as="uint256"/>
      <ts:mapping>
        <ts:option key="Some street">
          <ts:value>Another Street</ts:value>
        </ts:option>
      </ts:mapping>
    </ts:origins>
```

But this is valid:

```
    <ts:origins>
      <ts:ethereum contract="EntryToken" function="getStreet" as="utf8"/>
      <ts:mapping>
        <ts:option key="Some street">
          <ts:value>Another Street</ts:value>
        </ts:option>
      </ts:mapping>
    </ts:origins>
```
