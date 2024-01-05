// @ts-nocheck
// @ts-nocheck
// @ts-nocheck
// @ts-nocheck
export const ContractAbi = `{"source":{"hash":"0x3df78f3d4c108032446c4026173c48ca179f1f5ed1eb77f10d82dabaee77d024","language":"ink! 4.0.0","compiler":"rustc 1.70.0-nightly","build_info":{"build_mode":"Release","cargo_contract_version":"2.0.2","rust_toolchain":"nightly-aarch64-apple-darwin","wasm_opt_settings":{"keep_debug_symbols":false,"optimization_passes":"Z"}}},"contract":{"name":"faucet","version":"0.0.1","authors":["Starlay Finance"]},"spec":{"constructors":[{"args":[],"docs":[],"label":"new","payable":false,"returnType":{"displayName":["ink_primitives","ConstructorResult"],"type":0},"selector":"0x9bae9d5e"}],"docs":[],"events":[],"lang_error":{"displayName":["ink","LangError"],"type":2},"messages":[{"args":[{"label":"asset","type":{"displayName":["AccountId"],"type":3}},{"label":"amount","type":{"displayName":["Balance"],"type":6}},{"label":"account","type":{"displayName":["Option"],"type":7}}],"docs":[],"label":"mint","mutates":false,"payable":false,"returnType":{"displayName":["ink","MessageResult"],"type":8},"selector":"0xcfdd9aa2"},{"args":[{"label":"pool","type":{"displayName":["AccountId"],"type":3}},{"label":"amount","type":{"displayName":["Balance"],"type":6}},{"label":"account","type":{"displayName":["Option"],"type":7}}],"docs":[],"label":"mint_underlying","mutates":false,"payable":false,"returnType":{"displayName":["ink","MessageResult"],"type":8},"selector":"0xd0c828e3"},{"args":[{"label":"controller","type":{"displayName":["AccountId"],"type":3}},{"label":"amount","type":{"displayName":["Balance"],"type":6}},{"label":"account","type":{"displayName":["Option"],"type":7}}],"docs":[],"label":"mint_underlying_all","mutates":false,"payable":false,"returnType":{"displayName":["ink","MessageResult"],"type":8},"selector":"0x43adbfd9"}]},"storage":{"root":{"layout":{"struct":{"fields":[],"name":"Faucet"}},"root_key":"0x00000000"}},"types":[{"id":0,"type":{"def":{"variant":{"variants":[{"fields":[{"type":1}],"index":0,"name":"Ok"},{"fields":[{"type":2}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":1},{"name":"E","type":2}],"path":["Result"]}},{"id":1,"type":{"def":{"tuple":[]}}},{"id":2,"type":{"def":{"variant":{"variants":[{"index":1,"name":"CouldNotReadInput"}]}},"path":["ink_primitives","LangError"]}},{"id":3,"type":{"def":{"composite":{"fields":[{"type":4,"typeName":"[u8; 32]"}]}},"path":["ink_primitives","types","AccountId"]}},{"id":4,"type":{"def":{"array":{"len":32,"type":5}}}},{"id":5,"type":{"def":{"primitive":"u8"}}},{"id":6,"type":{"def":{"primitive":"u128"}}},{"id":7,"type":{"def":{"variant":{"variants":[{"index":0,"name":"None"},{"fields":[{"type":3}],"index":1,"name":"Some"}]}},"params":[{"name":"T","type":3}],"path":["Option"]}},{"id":8,"type":{"def":{"variant":{"variants":[{"fields":[{"type":9}],"index":0,"name":"Ok"},{"fields":[{"type":2}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":9},{"name":"E","type":2}],"path":["Result"]}},{"id":9,"type":{"def":{"variant":{"variants":[{"fields":[{"type":1}],"index":0,"name":"Ok"},{"fields":[{"type":10}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":1},{"name":"E","type":10}],"path":["Result"]}},{"id":10,"type":{"def":{"variant":{"variants":[{"fields":[{"type":11,"typeName":"String"}],"index":0,"name":"Custom"},{"index":1,"name":"InsufficientBalance"},{"index":2,"name":"InsufficientAllowance"},{"index":3,"name":"ZeroRecipientAddress"},{"index":4,"name":"ZeroSenderAddress"},{"fields":[{"type":11,"typeName":"String"}],"index":5,"name":"SafeTransferCheckFailed"}]}},"path":["openbrush_contracts","traits","errors","psp22","PSP22Error"]}},{"id":11,"type":{"def":{"sequence":{"type":5}}}}],"version":"4"}`;
export const ContractFile = `{"source":{"hash":"0x3df78f3d4c108032446c4026173c48ca179f1f5ed1eb77f10d82dabaee77d024","language":"ink! 4.0.0","compiler":"rustc 1.70.0-nightly","wasm":"0x0061736d0100000001450b60027f7f0060037f7f7f0060000060047f7f7f7f017f60037f7f7f017f60017f017f60057f7f7e7e7f0060087f7f7e7f7f7f7f7f017f60017f0060037e7e7f006000017f02900108057365616c310b6765745f73746f726167650003057365616c301176616c75655f7472616e736665727265640000057365616c310463616c6c0007057365616c3005696e7075740000057365616c300663616c6c65720000057365616c320b7365745f73746f726167650003057365616c300b7365616c5f72657475726e000103656e76066d656d6f727902010210031a19040500080000010000090a01000001000200000202060605040608017f01418080040b071102066465706c6f79001a0463616c6c001b0af138192b01017f037f2002200346047f200005200020036a200120036a2d00003a0000200341016a21030c010b0b0b3301027f230041106b22012400200141086a2000100920012d0009210020012d0008200141106a2400410171452000410146710b3c01017f200020012802042202047f2001200241016b36020420012001280200220141016a36020020012d00000520010b3a000120002002453a00000b080020004101100b0b2d01017f2000280208220220002802044904402000200241016a360208200028020020026a20013a00000f0b000b0a00200120004120100d0b4801027f024002402000280208220320026a22042003490d00200420002802044b0d00200420036b2002470d01200028020020036a2001200210071a200020043602080f0b000b000bde0302047f027e230041d0006b22022400024002402001280204220441204f04402001200441206b220536020420012001280200220341206a360200200241186a200341086a290000370300200241206a200341106a290000370300200241286a200341186a2900003703002002200329000037031020054110490d012001200441306b3602042001200341306a360200200341286a290000210620032900202107200241086a20011009024020022d00084101710d000240024020022d000922030e020100020b200128020422044120490d012001200441206b36020420012001280200220141206a360200200241386a200141086a290000370300200241406b200141106a290000370300200241c8006a200141186a290000370300200220012900003703300b200020073703202000200229033037003120002002290310370000200020033a0030200041286a2006370300200041c9006a200241c8006a290300370000200041c1006a200241406b290300370000200041396a200241386a290300370000200041086a200241186a290300370000200041106a200241206a290300370000200041186a200241286a2903003700000c030b200041023a00300c020b200041023a00300c010b200041023a00300b200241d0006a24000b2601017f230041106b220224002002200036020c20012002410c6a4104100d200241106a24000b2a01017f230041106b220324002003200137030820032000370300200220034110100d200341106a24000b5502027f027e230041206b22002400200041106a22014200370300200042003703082000411036021c200041086a2000411c6a10012001290300210220002903082103200041206a2400410541042002200384501b0b7c01017f230041106b2203240002402001413f4d044020022001410274100b0c010b200141ffff004d0440200320014102744101723b010e20022003410e6a4102100d0c010b200141ffffffff034d044020014102744102722002100f0c010b20024103100b20012002100f0b200220002001100d200341106a24000bc20101057f230041106b22032400200341086a20011014024002402003280208450440024020012802042205200328020c2202490d0002402002450440410121040c010b20024100480d04200320024101101520032802002204450d04200128020421050b200220054b0d002004200128020022042002100721062001200520026b3602042001200220046a3602002000200236020820002006360204200020023602000c020b200041003602040c010b200041003602040b200341106a24000f0b000bc30201047f230041206b22022400200241086a2001100941012104024020022d00084101710d00024002400240024020022d0009220341037122054103470440200541016b0e020302010b200341ff017141044f0d04200128020422054104490d042001280200220428000021032001200541046b3602042001200441046a36020020034180808080044921040c040b200341fc01714102762103410021040c030b200220033a0015200241013a0014200220013602102002410036021c200241106a2002411c6a4104101f450d010c020b200220033a0015200241013a001420022001360210200241003b011c200241106a2002411c6a4102101f0d0120022f011c220141ff014d0d0120014102762103410021040c010b200228021c220141808004492104200141027621030b2000200336020420002004360200200241206a24000bb50101017f027f41012001450d001a20024504402001101e0c010b410041b08004280200220220016a22032002490d001a024041b480042802002003490440200141ffff036a22032001490d01200341107640002202417f46200241ffff0371200247720d012002411074220220034180807c716a22032002490d0141b4800420033602004100200120026a22032002490d021a0b41b08004200336020020020c010b41000b210220002001360204200020023602000ba90201027f230041106b22022400200241808001360204200241b8800436020002402002027f02400240024020012802002203410747044041b8800441003a00002003410646044041b9800441003a000041020c050b41b9800441013a000002400240024002400240200341016b0e050701020304000b2002410336020841ba800441003a0000200141086a2802002001410c6a280200200210120c050b41ba800441023a00000c060b41ba800441033a000041030c060b41ba800441043a00000c040b41ba800441053a000020024103360208200141086a2802002001410c6a280200200210120c010b41b8800441013a0000200241013602082002100a0b2002280208220141818001490d03000b41ba800441013a00000b41030b22013602080b200020011019000b4501017f230041106b2200240041b8800441013a0000200041b8800436020020004280808180103702042000100a20002802082200418180014f0440000b410120001019000b0a00200120004104100d0b0d00200041b8800420011006000ba20101027f230041106b220024000240101141ff01714105470d0020004180800136020041b880042000100320002802002201418180014f0d00024020014104490d0041b88004280200419bddf6f405470d00200042808001370204200041b8800436020041002000100f2000280208220120002802044b0d01200028020022002001200020016a410010051a41b8800441003b0100410041021019000b1017000b000bb61602107f027e23004190026b220024000240027f02400240101141ff01714105470d002000418080013602800141b8800420004180016a10032000280280012201418180014f0d0002400240024020014104490d00200041bc8004360280022000200141046b3602840241b880042802002201411876210220014110762103200141087621040240024002400240200141ff0171220141cf016b0e020001020b200441ff017141dd0147200341ff0171419a014772200241a20147720d0320004180016a20004180026a100e20002d00b00122074102460d03200041e0016a20004189016a290000370300200041e8016a20004191016a290000370300200041ef016a20004198016a29000037000020002000290081013703d801200041a8016a290300211020002903a001211120002d0080012104200041d8006a200041b1016a412710071a410021020c020b200441ff017141c80147200341ff017141284772200241e30147720d0220004180016a20004180026a100e20002d00b00122074102460d02200041e0016a20004189016a290000370300200041e8016a20004191016a290000370300200041ef016a20004198016a29000037000020002000290081013703d801200041a8016a290300211020002903a001211120002d0080012104200041d8006a200041b1016a412710071a410121020c010b200141c30047200441ff017141ad014772200341ff017141bf0147200241d9014772720d0120004180016a20004180026a100e4102210220002d00b00122074102460d01200041e0016a20004189016a290000370300200041e8016a20004191016a290000370300200041ef016a20004198016a29000037000020002000290081013703d801200041a8016a290300211020002903a001211120002d0080012104200041d8006a200041b1016a412710071a0b200041cf006a200041ef016a290000370000200041c8006a200041e8016a290300370300200041406b200041e0016a290300370300200020002903d801370338200041116a200041d8006a412710071a20004280800137028401200041b8800436028001410020004180016a100f20002802840122052000280288012201490d0320002802800121032000200520016b22053602800120032001200120036a20004180016a100021012005200028028001492001410c4f720d032001410274418080046a2802000d03024002400240200241016b0e020102000b200041e1006a200041406b290300370000200041e9006a200041c8006a290300370000200041f0006a200041cf006a290000370000200020043a00582000200029033837005920004189016a200041196a29000037000020004191016a200041216a29000037000020004199016a200041296a290000370000200020073a0080012000200029001137008101200041d8016a200041d8006a2011201020004180016a2201101c0c080b200041e1006a200041406b290300370000200041e9006a200041c8006a290300370000200041f0006a200041cf006a290000370000200020043a00582000200029033837005920004189016a200041196a29000037000020004191016a200041216a29000037000020004199016a200041296a290000370000200020073a0080012000200029001137008101200041d8016a200041d8006a2011201020004180016a2201101d0c070b200041f0016a200041296a290000370300200041e8016a200041216a290000370300200041e0016a200041196a290000370300200020002900113703d80120004189016a200041406b29030037000020004191016a200041c8006a29030037000020004198016a200041cf006a290000370000200041a8016a4200370300200041b0016a4200370300200020043a0080012000200029033837008101200042003703a001200042b69ae2820b3703b80120004280800137025c200041b8800436025820004180016a200041d8006a100c200028025c220320002802602201490d0320002802582102200041003602602000200320016b36025c2000200120026a36025842004200200041d8006a1010200028025c220420002802602201490d0320002802582103200041003602602000200420016b36025c2000200120036a360258200041b8016a200041d8006a1018200028025c220520002802602201490d03200028025821042000200520016b2205360258410020024200200320042001200120046a2201200041d8006a10022102200520002802582203492002410b4b722003452002417d7172720d032000200341016b3602fc012000200141016a3602f801024020012d00000e020002040b200041086a200041f8016a101420002802080d034101210320002802fc014105762201200028020c220420012004491b22020440200241ffffff1f4b0d042002410574101e2203450d040b410021012000410036028802200020033602840220002002360280022004450d02034020002802fc0122054120490d04200041e0006a220c20002802f801220241086a290000370300200041e8006a220d200241106a290000370300200041f0006a220e200241186a2900003703002000200541206b3602fc012000200241206a3602f80120002002290000370358200028028002200147047f20010520004180026a210a230041206b2203240002400240200141016a2201450d00200a280200220220026a22052002490d0041042005200120012005491b2201200141044d1b220b4105742101200b418080802049210602402002044020034101360218200320024105743602142003200a2802043602100c010b200341003602180b200341106a2108230041106b220524002003027f0240027f0240200604400240200141004e044020082802080d0120052001410010152005280204210220052802000c040b0c040b2008280204220f450440200541086a200141001015200528020c210220052802080c030b20012102410041b08004280200220620016a22092006490d021a2008280200210841b480042802002009490440200141ffff036a220941107640002202417f46200241ffff0371200247720d022002411074220620094180807c716a22022006490d0241b480042002360200200121024100200120066a22092006490d031a0b41b08004200936020041002006450d021a20062008200f10070c020b200320013602040c020b2001210241000b2206044020032006360204200341086a200236020041000c020b20032001360204200341086a410136020041010c010b200341086a410036020041010b360200200541106a24002003280200450d01200341086a2802001a0b000b20032802042101200a200b360200200a2001360204200341206a240020002802840221032000280288020b220241057420036a22012000290358370000200141186a200e290300370000200141106a200d290300370000200141086a200c290300370000200241016a2201450d042000200136028802200441016b22040d000b200241057441206a210120004180016a410172210403400240200420002903d801370000200441086a200041e0016a290300370000200441106a200041e8016a290300370000200441186a200041f0016a290300370000200020073a008001200041d8006a20032011201020004180016a101d200028025822024106470d00200341206a2103200141206b22010d010c060b0b20004188026a200041e4006a2802003602002000200029025c3703800241010c050b1017000b200041f8016a10081a0c010b20030d010b000b4106210241000b2000418c016a20004188026a280200360200200020002903800237028401200020023602800120004180016a1016000b20002802d80120004188016a200041e0016a290300370300200020002903d8013703800141064720011016000be20702097f017e23004190026b2205240020054180800136025841b88004200541d8006a220a100420054198016a41c18004290000370300200541a0016a41c98004290000370300200541a7016a41d08004290000370000200541b9800429000037039001200541086a2207200441026a20054190016a220920042d000022081b220641086a290000370300200541106a220b200641106a290000370300200541176a220c200641176a2900003700002005200629000037030041b880042d0000210620042d0001210420054180016a420037030020054188016a4200370300200541f0006a200141186a290000370300200541e8006a200141106a290000370300200541e0006a200141086a29000037030020054200370378200520012900003703582009200a413810071a200541206a22012009413810071a20092001413810071a200541f0016a2003370300200541e8016a2002370300200541f8016a220d41fcf9d4a37d360200200541c9016a2005290300370000200541d1016a2007290300370000200541d9016a200b290300370000200541e0016a200c29000037000020052004200620081b3a00c801200541003602800220052903c001210e20054280800137025c200541b880043602582009200a100c0240200528025c220420052802602201490d0020052802582106200541003602602005200420016b36025c2005200120066a36025820052903b001200541b8016a290300200541d8006a1010200528025c220720052802602204490d0020052802582101200541003602602005200720046b36025c2005200120046a360258200d200541d8006a22041018200541c8016a2004100c2002200320041010200528025c220820052802602204490d00200528025821072005200820046b220836025841002006200e200120072004200420076a2204200541d8006a10022107200820052802582206492007410b4b722006452007417d7172720d002005200641016b220836028c022005200441016a2207360288020240024020042d00000e020001020b2008450d01410621040240024020072d00000e020100030b20064102460d022005200641036b36028c022005200741016a220441016a360288020240024002400240024020042d000022040e06000501020304070b200541d8006a20054188026a1013200528025c450d06200529025c210320052802582101410021040c040b410221040c030b410321040c020b410421040c010b200541d8006a20054188026a1013200528025c450d02200529025c210320052802582101410521040b20002003370208200020013602042000200436020020054190026a24000f0b20054188026a10081a0b000b870602077f017e230041e0016b22052400200541a0016a22074200370300200541a8016a420037030020054190016a200141186a29000037030020054188016a200141106a29000037030020054180016a200141086a290000370300200542003703980120052001290000370378200541406b2206200541f8006a2201413810071a20012006413810071a200542efa1f8ae0f3703b00120052903a801210c2005428080013702bc01200541b880043602b8012001200541b8016a100c024020052802bc01220620052802c0012201490d0020052802b8012108200541003602c0012005200620016b3602bc012005200120086a3602b8012005290398012007290300200541b8016a101020052802bc01220720052802c0012201490d0020052802b8012106200541003602c0012005200720016b3602bc012005200120066a3602b801200541b0016a200541b8016a101820052802bc01220720052802c0012201490d0020052802b80121092005200720016b22073602b80141002008200c200620092001200120096a2208200541b8016a10022101200720052802b8012206492001410b4b722006452001417d7172720d002005200641016b22093602dc01410121062005200841016a22013602d80102400240024020082d000022080e020100030b200541d8016a1008450d020c010b20094120490d01200541c0016a2001410f6a290000370300200541c8016a200141176a290000370300200541d0016a2001411f6a2d00003a0000200520012900073703b8012001280003210620012f0001210720012d0000210a0b200541086a2201200541c0016a290300370300200541106a2209200541c8016a290300370300200541186a220b200541d0016a2802003a0000200520052903b80137030020080d00200541cf006a2001290300370000200541d7006a2009290300370000200541df006a200b2d00003a000020052006360043200520073b00412005200a3a004020052005290300370047200541f8006a22012004412110071a2000200541406b200220032001101c200541e0016a24000f0b000b9b0101027f027f410041b08004280200220120006a22022001490d001a41b4800428020020024904402000200041ffff036a22024b044041000f0b200241107640002201417f46044041000f0b2001200141ffff037147044041000f0b2001411074220120024180807c716a2202200149044041000f0b41b4800420023602004100200020016a22022001490d011a0b41b08004200236020020010b0b910101027f20002f01042103200041003a0004410121040240024020034101714504402000280200220028020422032002490d02200120002802002201200210071a0c010b200120034108763a0000200028020022002802042203200241016b2202490d01200141016a20002802002201200210071a0b2000200320026b3602042000200120026a360200410021040b20040b0b310100418480040b290100000002000000030000000400000005000000060000000700000008000000090000000c0000000b","build_info":{"build_mode":"Release","cargo_contract_version":"2.0.2","rust_toolchain":"nightly-aarch64-apple-darwin","wasm_opt_settings":{"keep_debug_symbols":false,"optimization_passes":"Z"}}},"contract":{"name":"faucet","version":"0.0.1","authors":["Starlay Finance"]},"spec":{"constructors":[{"args":[],"docs":[],"label":"new","payable":false,"returnType":{"displayName":["ink_primitives","ConstructorResult"],"type":0},"selector":"0x9bae9d5e"}],"docs":[],"events":[],"lang_error":{"displayName":["ink","LangError"],"type":2},"messages":[{"args":[{"label":"asset","type":{"displayName":["AccountId"],"type":3}},{"label":"amount","type":{"displayName":["Balance"],"type":6}},{"label":"account","type":{"displayName":["Option"],"type":7}}],"docs":[],"label":"mint","mutates":false,"payable":false,"returnType":{"displayName":["ink","MessageResult"],"type":8},"selector":"0xcfdd9aa2"},{"args":[{"label":"pool","type":{"displayName":["AccountId"],"type":3}},{"label":"amount","type":{"displayName":["Balance"],"type":6}},{"label":"account","type":{"displayName":["Option"],"type":7}}],"docs":[],"label":"mint_underlying","mutates":false,"payable":false,"returnType":{"displayName":["ink","MessageResult"],"type":8},"selector":"0xd0c828e3"},{"args":[{"label":"controller","type":{"displayName":["AccountId"],"type":3}},{"label":"amount","type":{"displayName":["Balance"],"type":6}},{"label":"account","type":{"displayName":["Option"],"type":7}}],"docs":[],"label":"mint_underlying_all","mutates":false,"payable":false,"returnType":{"displayName":["ink","MessageResult"],"type":8},"selector":"0x43adbfd9"}]},"storage":{"root":{"layout":{"struct":{"fields":[],"name":"Faucet"}},"root_key":"0x00000000"}},"types":[{"id":0,"type":{"def":{"variant":{"variants":[{"fields":[{"type":1}],"index":0,"name":"Ok"},{"fields":[{"type":2}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":1},{"name":"E","type":2}],"path":["Result"]}},{"id":1,"type":{"def":{"tuple":[]}}},{"id":2,"type":{"def":{"variant":{"variants":[{"index":1,"name":"CouldNotReadInput"}]}},"path":["ink_primitives","LangError"]}},{"id":3,"type":{"def":{"composite":{"fields":[{"type":4,"typeName":"[u8; 32]"}]}},"path":["ink_primitives","types","AccountId"]}},{"id":4,"type":{"def":{"array":{"len":32,"type":5}}}},{"id":5,"type":{"def":{"primitive":"u8"}}},{"id":6,"type":{"def":{"primitive":"u128"}}},{"id":7,"type":{"def":{"variant":{"variants":[{"index":0,"name":"None"},{"fields":[{"type":3}],"index":1,"name":"Some"}]}},"params":[{"name":"T","type":3}],"path":["Option"]}},{"id":8,"type":{"def":{"variant":{"variants":[{"fields":[{"type":9}],"index":0,"name":"Ok"},{"fields":[{"type":2}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":9},{"name":"E","type":2}],"path":["Result"]}},{"id":9,"type":{"def":{"variant":{"variants":[{"fields":[{"type":1}],"index":0,"name":"Ok"},{"fields":[{"type":10}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":1},{"name":"E","type":10}],"path":["Result"]}},{"id":10,"type":{"def":{"variant":{"variants":[{"fields":[{"type":11,"typeName":"String"}],"index":0,"name":"Custom"},{"index":1,"name":"InsufficientBalance"},{"index":2,"name":"InsufficientAllowance"},{"index":3,"name":"ZeroRecipientAddress"},{"index":4,"name":"ZeroSenderAddress"},{"fields":[{"type":11,"typeName":"String"}],"index":5,"name":"SafeTransferCheckFailed"}]}},"path":["openbrush_contracts","traits","errors","psp22","PSP22Error"]}},{"id":11,"type":{"def":{"sequence":{"type":5}}}}],"version":"4"}`;