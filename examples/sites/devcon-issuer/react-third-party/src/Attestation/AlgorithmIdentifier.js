import { Any, compareSchema, ObjectIdentifier, Sequence } from "asn1js";
import { getParametersValue, clearProps } from "pvutils";
//**************************************************************************************
/**
 * Class from RFC5280
 */
export default class AlgorithmIdentifier {
  //**********************************************************************************
  /**
   * Constructor for AlgorithmIdentifier class
   * @param {Object} [source={}]
   * @param {Object} [source.schema] asn1js parsed value to initialize the class from
   * @property {string} [algorithmId] ObjectIdentifier for algorithm (string representation)
   */
  constructor(source = {}) {
    if (typeof(source) == "string") {
      throw new TypeError("Unimplemented: Not accepting string yet.")
    }
    if (source instanceof ArrayBuffer) {
      const asn1 = fromBER(source)
      this.fromSchema(asn1.result);
    } else {
      /**
       * @type {string}
       * @desc ObjectIdentifier for algorithm (string representation)
       */
      this.algorithmId = getParametersValue(
          source,
          "algorithmId"
      );

      if ("algorithmParams" in source)
        /**
         * @type {Object}
         * @desc Any algorithm source
         */
        this.algorithmParams = getParametersValue(
            source,
            "algorithmParams",
            AlgorithmIdentifier.defaultValues("algorithmParams")
        );
    }
  }
  //**********************************************************************************
  /**
   * Return default values for all class members
   * @param {string} memberName String name for a class member
   */
   /* FIXME: algorithmParams is options hence not removed and we need to complete this with all parameters with their default value covered here.
   */
  static defaultValues(memberName) {
    switch (memberName) {
      case "algorithmParams":
        return new Any();
      default:
        throw new Error(
          `Invalid member name for AlgorithmIdentifier class: ${memberName}`
        );
    }
  }
  //**********************************************************************************
  /**
   * Compare values with default values for all class members
   * @param {string} memberName String name for a class member
   * @param {*} memberValue Value to compare with default value
   */
  static compareWithDefault(memberName, memberValue) {
    switch (memberName) {
      case "algorithmId":
        return memberValue === "";
      case "algorithmParams":
        return memberValue instanceof asn1js.Any;
      default:
        throw new Error(
          `Invalid member name for AlgorithmIdentifier class: ${memberName}`
        );
    }
  }
  //**********************************************************************************
  /**
   * Return value of pre-defined ASN.1 schema for current class
   *
   * ASN.1 schema:
   * ```asn1
   * AlgorithmIdentifier  ::=  Sequence  {
   *    algorithm               OBJECT IDENTIFIER,
   *    parameters              ANY DEFINED BY algorithm OPTIONAL  }
   * ```
   *
   * @param {Object} parameters Input parameters for the schema
   * @returns {Object} asn1js schema object
   */
  static schema(parameters = {}) {
    /**
     * @type {Object}
     * @property {string} algorithmIdentifier ObjectIdentifier for the algorithm
     * @property {string} algorithmParams Any algorithm parameters
     */
    const names = getParametersValue(parameters, "names", {});

    return new Sequence({
      name: names.blockName || "",
      optional: names.optional || false,
      value: [
        new ObjectIdentifier({ name: names.algorithmIdentifier || "algorithm" }),
        new Any({ name: names.algorithmParams || "parameters", optional: true }),
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
    clearProps(schema, ["algorithm", "params"]);
    //endregion

    //region Check the schema is valid
    const asn1 = compareSchema(
      schema,
      schema,
      AlgorithmIdentifier.schema({
        names: {
          algorithmIdentifier: "algorithm",
          algorithmParams: "params",
        },
      })
    );

    if (asn1.verified === false)
      throw new Error(
        "Object's schema was not verified against input data for AlgorithmIdentifier"
      );
    //endregion

    //region Get internal properties from parsed schema
    this.algorithmId = asn1.result.algorithm.valueBlock.toString();
    if ("params" in asn1.result) this.algorithmParams = asn1.result.params;
    //endregion
  }
  //**********************************************************************************
  /**
   * Convert current object to asn1js object and set correct values
   * @returns {Object} asn1js object
   */
  toSchema() {
    //region Create array for output sequence
    const outputArray = [];

    outputArray.push(new ObjectIdentifier({ value: this.algorithmId }));
    if (
      "algorithmParams" in this &&
      this.algorithmParams instanceof asn1js.Any === false
    )
      outputArray.push(this.algorithmParams);
    //endregion

    //region Construct and return new ASN.1 schema for this object
    return new Sequence({
      value: outputArray,
    });
    //endregion
  }
  //**********************************************************************************
  /**
   * Convertion for the class to JSON object
   * @returns {Object}
   */
  toJSON() {
    const object = {
      algorithmId: this.algorithmId,
    };

    if (
      "algorithmParams" in this &&
      this.algorithmParams instanceof asn1js.Any === false
    )
      object.algorithmParams = this.algorithmParams.toJSON();

    return object;
  }
  //**********************************************************************************
  /**
   * Check that two "AlgorithmIdentifiers" are equal
   * @param {AlgorithmIdentifier} algorithmIdentifier
   * @returns {boolean}
   */
  isEqual(algorithmIdentifier) {
    //region Check input type
    if (algorithmIdentifier instanceof AlgorithmIdentifier === false)
      return false;
    //endregion

    //region Check "algorithm_id"
    if (this.algorithmId !== algorithmIdentifier.algorithmId) return false;
    //endregion

    //region Check "algorithm_params"
    if ("algorithmParams" in this) {
      if ("algorithmParams" in algorithmIdentifier)
        return (
          JSON.stringify(this.algorithmParams) ===
          JSON.stringify(algorithmIdentifier.algorithmParams)
        );

      return false;
    }

    if ("algorithmParams" in algorithmIdentifier) return false;
    //endregion

    return true;
  }
  //**********************************************************************************
}
//**************************************************************************************
