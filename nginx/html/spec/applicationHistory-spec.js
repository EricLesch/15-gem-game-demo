const _ = require('lodash');
const ApplicationHistory = require('../scripts/app/state/boardState/ApplicationHistory');

describe('ApplicationHistory',
    function () {
        it('.populateWithState(array) should populate the history with an initial state',
            function () {

                const applicationHistory = new ApplicationHistory();

                const initialState = [1, 2, 3];

                applicationHistory.populateWithState(initialState);

                const stateStack = applicationHistory.getStateStack();

                expect(stateStack).toBe(initialState);
            }
        );

        it('.pushState(state) should have add a new state to the end of the stack',
            function () {
                const applicationHistory = new ApplicationHistory();

                const initialState = [1, 2, 3];

                applicationHistory.populateWithState(initialState);

                applicationHistory.pushState(4);

                const stateStack = applicationHistory.getStateStack();

                expect(_.includes(stateStack, 4));
            }
        );

        it('.undo() should return the previous state',
            function () {
                const applicationHistory = new ApplicationHistory();

                const initialState = [1, 2, 3];

                applicationHistory.populateWithState(initialState);

                applicationHistory.pushState(4);

                const lastState = applicationHistory.undo();

                expect(lastState).toBe(3);

            }
        );

        it('.undo() should return the initial state if there is only one state in the stack',
            function () {
                const applicationHistory = new ApplicationHistory();

                const initialState = [1];

                applicationHistory.populateWithState(initialState);

                const lastState = applicationHistory.undo();

                expect(lastState === 1).toBe(true);
            }
        );

        it('redo() should return undefined if there is nothing in the undo stack',
            function () {
                const applicationHistory = new ApplicationHistory();

                const lastState = applicationHistory.redo();

                expect(lastState).toBe(void 0);
            }
        );
        it('.redo() should return the next state on the undo stack',
            function () {
                const applicationHistory = new ApplicationHistory();

                const initialState = [1, 2, 3];

                applicationHistory.populateWithState(initialState);

                applicationHistory.pushState(4);

                applicationHistory.undo();

                const lastState = applicationHistory.redo();

                expect(lastState).toBe(4);

                const anotherState = applicationHistory.redo();

                expect(anotherState).toBe(void 0);
            }
        );

        it('.pushState(state) should clear the redoStack',
            function () {
                const applicationHistory = new ApplicationHistory();

                const initialState = [1, 2, 3];

                applicationHistory.populateWithState(initialState);

                applicationHistory.pushState(4);

                applicationHistory.undo();

                applicationHistory.pushState(5);

                const redoState = applicationHistory.redo();

                expect(redoState).toBe(void 0);
            }
        );
    }
);