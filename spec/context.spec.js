let expect = require('chai').expect;
import {instructionCodes} from '../src/operations'
import {system} from '../src/system';
import {context} from '../src/context'

describe('context', () => {
  describe('line', () => {
    it('should push values onto the instructions', () => {
      expect(context(system()).move([5, 12]).instructions).to.eql([instructionCodes.move, 5, 12]);
    });
  });
});