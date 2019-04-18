## Assembling the XML File

So, now that you have your token.en.shtml file, we are now ready to continue on to the XML file 
which will define the function calls, how we define the meaning of our tokens, 
off chain functionality of the token (in our example, it would be things 
like selling the token and redeeming the token) and plugging in the layout. 

Since NFTs like cryptokitties and our example can encode information inside their 32 bytes such 
as genes or what time the game is supposed to be held, we can use TokenScript to interpret 
the meaning of such tokens so that the user is given context.  

### Creating your own XML file

You can create your own XML file by simply copying the one below and filling it out to match your own requirements. If you would like to simply try this one as an example then simply copy and paste it into a .xml file. This file will later be referenced in step 4 for signing and formation of the .tsml file. 

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE tokenscript  [
    <!ENTITY fifa.en SYSTEM "https://raw.githubusercontent.com/AlphaWallet/TokenScript/add-fifa-wc-tokenscript-adapted/examples/ticket/cards/fifa.en.shtml">
    <!ENTITY style SYSTEM "https://raw.githubusercontent.com/AlphaWallet/TokenScript/add-fifa-wc-tokenscript-adapted/examples/ticket/cards/shared.css">
]>
<ts:token xmlns:ts="http://tokenscript.org/2019/04/tokenscript"
          xmlns="http://www.w3.org/1999/xhtml"
          xmlns:xml="http://www.w3.org/XML/1998/namespace">
          <ts:name xml:lang="ru">Ваучеры</ts:name>
          <ts:name xml:lang="en">Tickets</ts:name>
          <ts:name xml:lang="zh">门票</ts:name>
          <ts:name xml:lang="es">Cupones</ts:name>
  <ts:contract id="holding_contract" interface="erc875">
    <ts:address network="1">YOUR_TOKEN_HERE</ts:address>
  </ts:contract>
  <!-- consider metadata of tokens, e.g. quantifier in each languages -->
  <ts:selections>
    <ts:selection id="discounted">
      <ts:name xml:lang="en">Discount Tickets</ts:name>
      <ts:name xml:lang="zh">打折票</ts:name>
      <ts:filter>(|category=打折票)(category=Discounted))</ts:filter>
    </ts:selection>
    <ts:selection id="invited">
      <ts:name xml:lang="en">Gift Ticket</ts:name>
      <ts:name xml:lang="zh">赠票</ts:name>
      <ts:filter>gifted</ts:filter>
    </ts:selection>
    <ts:selection id="valid">
      <ts:name xml:lang="en">Tickets not expired</ts:name>
      <ts:name xml:lang="zh">末到期票</ts:name>
      <ts:filter>!expired</ts:filter>
    </ts:selection>
    <ts:selection id="expired">
      <ts:name xml:lang="en">Expired Tickets</ts:name>
      <ts:name xml:lang="zh">已经过期的票</ts:name>
      <ts:filter>expired</ts:filter>
    </ts:selection>
  </ts:selections>

  <ts:cards>
    <ts:token-card>
      <style type="text/css">&style;</style>
      <ts:view-iconified xml:lang="en">
      <!-- Reference the iconified and full view down here --->
        &fifa.en;
      </ts:view-iconified>
      <ts:view xml:lang="en">
        &fifa.en;
      </ts:view>
    </ts:token-card>
    <ts:action>
      <!-- this action is of the model confirm-back.
      It should be <ts:action model="confirm-back"> but Weiwu
      shied away from specifying that due to the likely change of design causing an upgrade path issue.

      window.onConfirm is called if user hit "confirm";
      window.close() causes the back button to be pressed.
      -->
      <ts:name xml:lang="en">Enter</ts:name>
      <ts:name xml:lang="zh">入場</ts:name>
      <ts:name xml:lang="es">Entrar</ts:name>
      <ts:exclude selection="expired"/>
      <style type="text/css">&style;</style>
      <ts:view xml:lang="en">
        &fifa.en;
      </ts:view>
    </ts:action>
  </ts:cards>

  <ts:ordering>
    <ts:order bitmask="FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF" name="default">
      <ts:byName field="locality"/>
      <ts:byValue field="match"/>
      <ts:byValue field="number"/>
    </ts:order>
    <ts:order bitmask="FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF" name="concise">
      <ts:byValue field="match"/>
      <ts:byValue field="category"/>
      <ts:byValue field="number"/>
    </ts:order>
  </ts:ordering>

  <!-- token UI definition can happen here -->
  <ts:attribute-types>
    <!--
    There are 64 matches (1-64), each has up to 16 ticket classes,
    within each class, there are less than 65536 tickets.  A compact
    format identifier would consist of 26 bits:

    [6] [4] [16]

    Representing:

        Match ID: 1-64
        Class: 1-16
        Seats: 0-65536

    These are represented by 7 hex codes. Therefore 0x40F0481 means
    the final match (64th), class F (highest) ticket number 1153. But
    we didn't end up using this compatct form.

    Information about a match, like Venue, City, Date, which team
    against which, can all be looked up by MatchID. There are
    advantages and disadvantages in encoding them by a look up table
    or by a bit field.

    The advantage of storing them as a bit field is that one can
    enquiry the range of it in the market queue server without the
    server kowing the meaning of the bitfields. Furthermore it make
    the android and ios library which accesses the XML file a bit
    easier to write, but at the cost that the ticket issuing
    (authorisation) server is a bit more complicated.

    For now we decide to use bit-fields.  The fields, together with
    its bitwidth or byte-width are represented in this table:

    Fields:           City,   Venue,  Date,   TeamA,  TeamB,  Match, Category
    Maximum, 2018:    11,     12,     32,     32,     32,     64,    16
    Maximum, all time:64,     64,     64,     32,     32,     64,    64
    Bitwidth:         6,      6,      6,      5,      5,      6,     6
    Bytewidth:        1,      1,      4,      3,      3,      1,     1,

    In practise, because this XML file is used in 3 to 4 places
    (authorisation server, ios, android, potentially market-queue),
    Weiwu thought that it helps the developers if we use byte-fields
    instead of bit-fields.
    1.3.6.1.4.1.1466.115.121.1.15 is DirectoryString
    1.3.6.1.4.1.1466.115.121.1.24 is GeneralisedTime
    1.3.6.1.4.1.1466.115.121.1.26 is IA5String
    1.3.6.1.4.1.1466.115.121.1.27 is Integer
  -->
    <ts:attribute-type id="locality" oid="2.5.4.7" syntax="1.3.6.1.4.1.1466.115.121.1.15">
      <ts:name xml:lang="en">City</ts:name>
      <ts:name xml:lang="zh">城市</ts:name>
      <ts:name xml:lang="es">Ciudad</ts:name>
      <ts:name xml:lang="ru">город</ts:name>
      <ts:origin as="mapping" bitmask="00000000000000000000000000000000FF000000000000000000000000000000">
        <ts:mapping>
          <ts:option key="1">
            <ts:value xml:lang="ru">Москва́</ts:value>
            <ts:value xml:lang="en">Moscow</ts:value>
            <ts:value xml:lang="zh">莫斯科</ts:value>
            <ts:value xml:lang="es">Moscú</ts:value>
          </ts:option>
          <ts:option key="2">
            <ts:value xml:lang="ru">Санкт-Петербу́рг</ts:value>
            <ts:value xml:lang="en">Saint Petersburg</ts:value>
            <ts:value xml:lang="zh">圣彼得堡</ts:value>
            <ts:value xml:lang="es">San Petersburgo</ts:value>
          </ts:option>
          <ts:option key="3">
            <ts:value xml:lang="ru">сочи</ts:value>
            <ts:value xml:lang="en">Sochi</ts:value>
            <ts:value xml:lang="zh">索契</ts:value>
            <ts:value xml:lang="es">Sochi</ts:value>
          </ts:option>
          <ts:option key="4">
            <ts:value xml:lang="ru">екатеринбург</ts:value>
            <ts:value xml:lang="en">Ekaterinburg</ts:value>
            <ts:value xml:lang="zh">叶卡捷琳堡</ts:value>
            <ts:value xml:lang="es">Ekaterinburg</ts:value>
          </ts:option>
          <ts:option key="5">
            <ts:value xml:lang="ru">Саранск</ts:value>
            <ts:value xml:lang="en">Saransk</ts:value>
            <ts:value xml:lang="zh">萨兰斯克</ts:value>
            <ts:value xml:lang="es">Saransk</ts:value>
          </ts:option>
          <ts:option key="6">
            <ts:value xml:lang="ru">казань</ts:value>
            <ts:value xml:lang="en">Kazan</ts:value>
            <ts:value xml:lang="zh">喀山</ts:value>
            <ts:value xml:lang="es">Kazan</ts:value>
          </ts:option>
          <ts:option key="7">
            <ts:value xml:lang="ru">Нижний Новгород</ts:value>
            <ts:value xml:lang="en">Nizhny Novgorod</ts:value>
            <ts:value xml:lang="zh">下诺夫哥罗德</ts:value>
            <ts:value xml:lang="es">Nizhny Novgorod</ts:value>
          </ts:option>
          <ts:option key="8">
            <ts:value xml:lang="ru">Ростов-на-Дону</ts:value>
            <ts:value xml:lang="en">Rostov-on-Don</ts:value>
            <ts:value xml:lang="zh">顿河畔罗斯托夫</ts:value>
            <ts:value xml:lang="es">Rostov-on-Don</ts:value>
          </ts:option>
          <ts:option key="9">
            <ts:value xml:lang="ru">Самара</ts:value>
            <ts:value xml:lang="en">Samara</ts:value>
            <ts:value xml:lang="zh">萨马拉</ts:value>
            <ts:value xml:lang="es">Samara</ts:value>
          </ts:option>
          <ts:option key="10">
            <ts:value xml:lang="ru">Волгоград</ts:value>
            <ts:value xml:lang="en">Volgograd</ts:value>
            <ts:value xml:lang="zh">伏尔加格勒</ts:value>
            <ts:value xml:lang="es">Volgogrado</ts:value>
          </ts:option>
          <ts:option key="11">
            <ts:value xml:lang="ru">Калининград</ts:value>
            <ts:value xml:lang="en">Kaliningrad</ts:value>
            <ts:value xml:lang="zh">加里宁格勒</ts:value>
            <ts:value xml:lang="es">Kaliningrad</ts:value>
          </ts:option>
        </ts:mapping>
      </ts:origin>
    </ts:attribute-type>
    <ts:attribute-type id="venue" syntax="1.3.6.1.4.1.1466.115.121.1.15">
      <ts:name xml:lang="en">Venue</ts:name>
      <ts:name xml:lang="zh">场馆</ts:name>
      <ts:name xml:lang="es">Lugar</ts:name>
      <ts:name xml:lang="ru">место встречи</ts:name>
      <ts:origin as="mapping" bitmask="0000000000000000000000000000000000FF0000000000000000000000000000">
        <ts:mapping>
          <ts:option key="1">
            <ts:value xml:lang="ru">Стадион Калининград</ts:value>
            <ts:value xml:lang="en">Kaliningrad Stadium</ts:value>
            <ts:value xml:lang="zh">加里宁格勒体育场</ts:value>
            <ts:value xml:lang="es">Estadio de Kaliningrado</ts:value>
          </ts:option>
          <ts:option key="2">
            <ts:value xml:lang="ru">Екатеринбург Арена</ts:value>
            <ts:value xml:lang="en">Volgograd Arena</ts:value>
            <ts:value xml:lang="zh">伏尔加格勒体育场</ts:value>
            <ts:value xml:lang="es">Volgogrado Arena</ts:value>
          </ts:option>
          <ts:option key="3">
            <ts:value xml:lang="ru">Казань Арена</ts:value>
            <ts:value xml:lang="en">Ekaterinburg Arena</ts:value>
            <ts:value xml:lang="zh">加里宁格勒体育场</ts:value>
            <ts:value xml:lang="es">Ekaterimburgo Arena</ts:value>
          </ts:option>
          <ts:option key="4">
            <ts:value xml:lang="ru">Мордовия Арена</ts:value>
            <ts:value xml:lang="en">Fisht Stadium</ts:value>
            <ts:value xml:lang="zh">费什体育场</ts:value>
            <ts:value xml:lang="es">Estadio Fisht</ts:value>
          </ts:option>
          <ts:option key="5">
            <ts:value xml:lang="ru">Ростов Арена</ts:value>
            <ts:value xml:lang="en">Kazan Arena</ts:value>
            <ts:value xml:lang="zh">喀山体育场</ts:value>
            <ts:value xml:lang="es">Kazan Arena</ts:value>
          </ts:option>
          <ts:option key="6">
            <ts:value xml:lang="ru">Самара Арена</ts:value>
            <ts:value xml:lang="en">Nizhny Novgorod Stadium</ts:value>
            <ts:value xml:lang="zh">下诺夫哥罗德体育场</ts:value>
            <ts:value xml:lang="es">Estadio de Nizhni Novgorod</ts:value>
          </ts:option>
          <ts:option key="7">
            <ts:value xml:lang="ru">Стадион Калининград</ts:value>
            <ts:value xml:lang="en">Luzhniki Stadium</ts:value>
            <ts:value xml:lang="zh">卢日尼基体育场</ts:value>
            <ts:value xml:lang="es">Estadio Luzhniki</ts:value>
          </ts:option>
          <ts:option key="8">
            <ts:value xml:lang="ru">Стадион Лужники</ts:value>
            <ts:value xml:lang="en">Samara Arena</ts:value>
            <ts:value xml:lang="zh">萨马拉体育场</ts:value>
            <ts:value xml:lang="es">Samara Arena</ts:value>
          </ts:option>
          <ts:option key="9">
            <ts:value xml:lang="ru">Стадион Нижний Новгород</ts:value>
            <ts:value xml:lang="en">Rostov Arena</ts:value>
            <ts:value xml:lang="zh">罗斯托夫体育场</ts:value>
            <ts:value xml:lang="es">Rostov Arena</ts:value>
          </ts:option>
          <ts:option key="10">
            <ts:value xml:lang="ru">Стадион Спартак</ts:value>
            <ts:value xml:lang="en">Spartak Stadium</ts:value>
            <ts:value xml:lang="zh">斯巴达克体育场</ts:value>
            <ts:value xml:lang="es">Estadio del Spartak</ts:value>
          </ts:option>
          <ts:option key="11">
            <ts:value xml:lang="ru">Стадион Санкт-Петербург</ts:value>
            <ts:value xml:lang="en">Saint Petersburg Stadium</ts:value>
            <ts:value xml:lang="zh">圣彼得堡体育场</ts:value>
            <ts:value xml:lang="es">Estadio de San Petersburgo</ts:value>
          </ts:option>
          <ts:option key="12">
            <ts:value xml:lang="ru">Стадион Фишт</ts:value>
            <ts:value xml:lang="en">Mordovia Arena</ts:value>
            <ts:value xml:lang="zh">莫多维亚体育场</ts:value>
            <ts:value xml:lang="es">Mordovia Arena</ts:value>
          </ts:option>
        </ts:mapping>
      </ts:origin>
    </ts:attribute-type>
    <ts:attribute-type id="time" syntax="1.3.6.1.4.1.1466.115.121.1.24">
      <ts:name xml:lang="en">Time</ts:name>
      <ts:name xml:lang="zh">时间</ts:name>
      <ts:name xml:lang="es">Tiempo</ts:name>
      <ts:name xml:lang="ru">время</ts:name>
      <!-- keys used here are BinaryTime (RFC6019) for backward compatibility,
           don't copy this behaviour when creating new assets -->
      <ts:origin as="mapping" bitmask="000000000000000000000000000000000000FFFFFFFF00000000000000000000">
        <ts:mapping>
          <!-- Shanghai -->
          <ts:option key="1531576800">
            <ts:value>20180714170000+0300</ts:value>
          </ts:option>
          <!-- Hong Kong -->
          <ts:option key="1531328400">
            <ts:value>20180711090000+0800</ts:value>
          </ts:option>
        </ts:mapping>
      </ts:origin>
    </ts:attribute-type>
    <ts:attribute-type id="countryA" syntax="1.3.6.1.4.1.1466.115.121.1.26">
      <!-- Intentionally avoid using countryName
       (SYNTAX 1.3.6.1.4.1.1466.115.121.1.11) per RFC 4519
           CountryName is two-characters long, not 3-characters.
       -->
      <ts:name xml:lang="en">Team A</ts:name>
      <ts:name xml:lang="zh">甲队</ts:name>
      <ts:name xml:lang="es">Equipo A</ts:name>
      <ts:origin as="utf8" bitmask="00000000000000000000000000000000000000000000FFFFFF00000000000000"/>
    </ts:attribute-type>
    <ts:attribute-type id="countryB" syntax="1.3.6.1.4.1.1466.115.121.1.26">
      <ts:name xml:lang="en">Team B</ts:name>
      <ts:name xml:lang="zh">乙队</ts:name>
      <ts:name xml:lang="es">Equipo B</ts:name>
      <ts:origin as="utf8" bitmask="00000000000000000000000000000000000000000000000000FFFFFF00000000"/>
    </ts:attribute-type>
    <ts:attribute-type id="match" syntax="1.3.6.1.4.1.1466.115.121.1.27">
      <ts:name xml:lang="en">Match</ts:name>
      <ts:name xml:lang="zh">场次</ts:name>
      <ts:name xml:lang="es">Evento</ts:name>
      <ts:origin as="unsigned" bitmask="00000000000000000000000000000000000000000000000000000000FF000000"/>
    </ts:attribute-type>
    <ts:attribute-type id="category" syntax="1.3.6.1.4.1.1466.115.121.1.15">
      <ts:name xml:lang="en">Cat</ts:name>
      <ts:name xml:lang="zh">等级</ts:name>
      <ts:name xml:lang="es">Cat</ts:name>
      <ts:origin as="mapping" bitmask="0000000000000000000000000000000000000000000000000000000000FF0000">
        <ts:mapping>
          <ts:option key="1">
            <ts:value xml:lang="en">Category 1</ts:value>
            <ts:value xml:lang="zh">一类票</ts:value>
          </ts:option>
          <ts:option key="2">
            <ts:value xml:lang="en">Category 2</ts:value>
            <ts:value xml:lang="zh">二类票</ts:value>
          </ts:option>
          <ts:option key="3">
            <ts:value xml:lang="en">Category 3</ts:value>
            <ts:value xml:lang="zh">三类票</ts:value>
          </ts:option>
          <ts:option key="4">
            <ts:value xml:lang="en">Category 4</ts:value>
            <ts:value xml:lang="zh">四类票</ts:value>
          </ts:option>
          <ts:option key="5">
            <ts:value xml:lang="en">Match Club</ts:value>
            <ts:value xml:lang="zh">俱乐部坐席</ts:value>
          </ts:option>
          <ts:option key="6">
            <ts:value xml:lang="en">Match House Premier</ts:value>
            <ts:value xml:lang="zh">比赛之家坐席</ts:value>
          </ts:option>
          <ts:option key="7">
            <ts:value xml:lang="en">MATCH PAVILION</ts:value>
            <ts:value xml:lang="zh">款待大厅坐席</ts:value>
          </ts:option>
          <ts:option key="8">
            <ts:value xml:lang="en">MATCH BUSINESS SEAT</ts:value>
            <ts:value xml:lang="zh">商务坐席</ts:value>
          </ts:option>
          <ts:option key="9">
            <ts:value xml:lang="en">MATCH SHARED SUITE</ts:value>
            <ts:value xml:lang="zh">公共包厢</ts:value>
          </ts:option>
          <ts:option key="10">
            <ts:value xml:lang="en">TSARSKY LOUNGE</ts:value>
            <ts:value xml:lang="zh">特拉斯基豪华包厢</ts:value>
          </ts:option>
          <ts:option key="11">
            <ts:value xml:lang="en">MATCH PRIVATE SUITE</ts:value>
            <ts:value xml:lang="zh">私人包厢</ts:value>
          </ts:option>
        </ts:mapping>
      </ts:origin>
    </ts:attribute-type>
    <ts:attribute-type id="numero" syntax="1.3.6.1.4.1.1466.115.121.1.27">
      <ts:name>№</ts:name>
      <ts:origin as="unsigned" bitmask="000000000000000000000000000000000000000000000000000000000000FFFF"/>
    </ts:attribute-type>
  </ts:attribute-types>
</ts:token>