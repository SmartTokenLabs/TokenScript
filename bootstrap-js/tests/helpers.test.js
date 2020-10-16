let ts = require("../modules/ts_helpers.js");

test("Returns string query compared to object", () => {
    let str1 = "(&(objectClass=Person)(!(price<=4444))(|(locality=Jensen)(locality=Sydney)(locality=Babs J*)((locality=Sy*))))";
    let str2 = "(&(!(price<=4444))(|(locality=Jensen)(locality=Sydney)(locality=Babs J*)((locality=Sy*))))";
    let str3 = "(ownerBalance=)";
    let props = {
        locality: 'Sydney',
        state: 'NSW',
        price: 15559
    }
    expect(ts.compareStringToProps(str1, props)).toBe(0);
    expect(ts.compareStringToProps(str2, props)).toBe(1);
    expect(ts.compareStringToProps(str3, props)).toBe(0);
    expect(ts.compareStringToProps("  ", props)).toBe(1);
});

/**
 * @jest-environment jsdom
 */
test("test getContractAddress", () => {


    let tokenXMLText = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        '<ts:token xmlns:ethereum="urn:ethereum:constantinople"\n' +
        '          xmlns:ts="http://tokenscript.org/2020/06/tokenscript"\n' +
        '          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
        '          name="entrytoken"\n' +
        '          xsi:schemaLocation="http://tokenscript.org/2020/06/tokenscript http://tokenscript.org/2020/06/tokenscript.xsd"\n' +
        '>' +
        '  <ts:contract interface="erc875" name="EntryToken">\n' +
        '    <ts:address network="1">0x63cCEF733a093E5Bd773b41C96D3eCE361464942</ts:address>\n' +
        '    <ts:address network="3">0xFB82A5a2922A249f32222316b9D1F5cbD3838678</ts:address>\n' +
        '    <ts:address network="4">0x59a7a9fd49fabd07c0f8566ae4be96fcf20be5e1</ts:address>\n' +
        '    <ts:address network="42">0x2B58A9403396463404c2e397DBF37c5EcCAb43e5</ts:address>\n' +
        '  </ts:contract>' +
        '</ts:token>';

    var parser = new DOMParser();
    let xmlDoc =  parser.parseFromString(tokenXMLText, "text/xml");
    let nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
    let tokenNodes = xmlDoc.evaluate('/ts:token', xmlDoc, nsResolver, XPathResult.ANY_TYPE, null );
    let tokenNode = tokenNodes.iterateNext();

    expect(ts.getContractAddress(xmlDoc, "EntryToken", tokenNode, 3)).toMatchObject({'contractAddress':'0xFB82A5a2922A249f32222316b9D1F5cbD3838678','contractInterface':'erc875'});
    expect(ts.getContractAddress(xmlDoc, "EntryToken", tokenNode, 42)).toMatchObject({contractInterface:'erc875',contractAddress:'0x2B58A9403396463404c2e397DBF37c5EcCAb43e5'});
});

// test("test getJSONAbi", () => {
//
//     global.fetch = jest.fn((url) =>
//         Promise.resolve({
//             status: 400
//         })
//     );
//
//     expect(ts.getJSONAbi('somecontract',{})).toBe(false);
//
//
//
// });

it('getJSONAbi file not found', () => {
    expect.assertions(1);

        global.fetch = jest.fn((url) =>
        Promise.resolve({
            status: 400
        })
    );

    return expect(ts.getJSONAbi('somecontract',{})).resolves.toEqual(false);

});

it('getJSONAbi already added', async () => {
    expect.assertions(1);
    const data = await ts.getJSONAbi('somecontract',{somecontract:{val1: 2}});
    expect(data).toMatchObject({val1: 2});
});


