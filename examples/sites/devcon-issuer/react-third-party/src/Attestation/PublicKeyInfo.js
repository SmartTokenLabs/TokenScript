import {
  BitString,
  compareSchema,
  Integer,
  OctetString,
  Sequence,
  fromBER,
  Any,
  ObjectIdentifier
} from "asn1js";
import { getParametersValue, clearProps } from "pvutils";
import AlgorithmIdentifier from "./AlgorithmIdentifier.js";
//**************************************************************************************
/**
 * Class from RFC5280
 */
export default class PublicKeyInfo {
  //**********************************************************************************
  /**
   * Constructor for PublicKeyInfo class
   * @param {Object} [source={}]
   * @param {Object} [source.schema] asn1js parsed value to initialize the class from
   * @property {string} [algorithmId] ObjectIdentifier for algorithm (string representation)
   */
  constructor(source = {}) {
    if (typeof(source) == "string") {
      throw new TypeError("Not accepting string. For base64, convert to ArrayBuffer.")
    }
    if (source instanceof ArrayBuffer) {
      const asn1 = fromBER(source)
      this.fromSchema(asn1.result);
    } else {
      /**
       * @type {string}
       * @desc ObjectIdentifier for algorithm (string representation)
       */
      this.signatureAlgorithm = getParametersValue(
          source,
          "signatureAlgorithm"
      );
	  this.publicKey = getParametersValue(
          source,
          "publicKey"
      );
    }
  }
 
  //**********************************************************************************
  /**
   * Return value of pre-defined ASN.1 schema for current class
   *
   * ASN.1 schema:
   * ```asn1
   * PublicKeyInfo  ::=  Sequence  {
   *    signatureAlgorithm               AlgorithmIdentifier,
   *    publicKey              BIT-STRING  }
   * ```
   *
   * @param {Object} parameters Input parameters for the schema
   * @returns {Object} asn1js schema object
   */
  static schema(parameters = {}) {
    /**
     * @type {Object}
     * @property {string} signatureAlgorithm ObjectIdentifier for the algorithm
     * @property {string} publicKey Any algorithm parameters
     */
    const names = getParametersValue(parameters, "names", {});

    return new Sequence({
      name: names.blockName || "",
      optional: true,
      value: [
		AlgorithmIdentifier.schema(
			names.signatureAlgorithm || {
			  names: {
				blockName: "signatureAlgorithm",
			  },
			}
		),
        new BitString({ name: "publicKey"}),
      ],
    });
  }
  //**********************************************************************************
  /**
   * Convert parsed asn1js object into current class
   * @param {!Object} schema
   */
  fromSchema(schema) {
    //region Clear input data first
    clearProps(schema, ["signatureAlgorithm", "publicKey"]);
    //endregion

    //region Check the schema is valid
    const asn1 = compareSchema(
      schema,
      schema,
      PublicKeyInfo.schema({
        names: {
          signatureAlgorithm: "signatureAlgorithm",
          publicKey: "publicKey",
        },
      })
    );

    if (asn1.verified === false)
      throw new Error(
        "Object's schema was not verified against input data for AlgorithmIdentifier"
      );
    //endregion
  }
}
//**************************************************************************************
