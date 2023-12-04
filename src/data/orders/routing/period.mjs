import { error } from "console";

/**class that models time interval behavior */
export class Period {
  min = -Infinity
  max = Infinity

  /**
   * If an endpoint is not specified, the Period interval is assumed to be
   * unbounded on that side.
   */
  constructor(min, max) {
    if (max < min) throw new error("max cannot be less than min")
    this.min = min
    this.max = max
  }

  get value() { return [this.min, this.max] }

  contains(number) {
    return this.min <= number && number < this.max
  }

  /**
   * true if Periods share at least one point in time
   * @param {Period} P2 
   * @returns {boolean}
  */
  intersects(P2) {
    return P2.contains(this.min) || this.contains(P2.min)
  }

  excludes(P2) {
    return !this.intersects(P2)
  }

  /**
   * Specific type of exclusion where no gap exists between periods
   * @param {Period} P2 
   * @returns {boolean}
   */
  meets(P2) {
    return this.max === P2.min
  }
  joins(P2) {
    return this.meets(P2) || P2.meets(this)
  }

  /**
   * Specific type of exclusion where no gap exists between periods
   * @param {Period} P2 
   * @returns {boolean}
   */
  before(P2) {
    return this.max < P2.min
  }
    
  /**
   * true if Periods intersect, but neither is a subset of the other
   * @param {Period} P2 
   * @returns {boolean}
   */
  overlaps(P2) {
    // sneaky: true if exactly 1 of the contains tests is true
    return P2.contains(this.min) !== this.contains(P2.min)
  }

  fills(P2) {
    return P2.min <= this.min && this.max <= P2.max
  }

  /**
   * @param {Period} P2 
   * @returns {boolean}
   */
  during(P2) {
    return P2.min < this.min && this.max < P2.max
  }
  

  /**
   * @param {Period} P2 
   * @returns {boolean}
   */
  equals(P2) {
    return this.min === P2.min && this.max === P2.max
  }



  /**
   * @param {Period} P2 
   * @returns {boolean}
   */
  starts(P2) {
    return this.min === P2.min && this.max < P2.max
  }

  /**
   * @param {Period} P2 
   * @returns {boolean}
   */
  finishes(P2) {
    return this.min > P2.min && this.max === P2.max
  }
  
} 



