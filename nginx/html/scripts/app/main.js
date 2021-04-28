import $ from 'jquery';

const PuzzleContainer = require('./PuzzleContainer');

/** main **/
$(
    function () {

        /** Get the parameters from the query string if they are there **/
        const urlParams = new URLSearchParams(window.location.search);

        const numberOfColumns = parseInt(urlParams.get('numberOfColumns'), 10) || 4;
        const numberOfRows = parseInt(urlParams.get('numberOfRows'), 10) || 4;
        const tileSize = parseInt(urlParams.get('tileSize'), 10) || 100;
        let optimizeRendering = !urlParams.get('optimizeRendering') || urlParams.get('optimizeRendering') === "true";

        /** jQuery is a mess for writing applications but this is a small enough example that it doesn't matter */
        let puzzleContainer = new PuzzleContainer(
            {
                numberOfColumns,
                numberOfRows,
                tileSize,
                optimizeRendering
            }
        );

        const $newPuzzleButton = $('.newPuzzleButtonJS');

        const $columnInput = $('.columnInputJS');
        const $rowInput = $('.rowInputJS');
        const $tileSize = $('.tileSizeJS');
        const $fastRender = $('.fastRenderJS');

        /** set the default values in the input box */
        $columnInput.val(numberOfColumns);
        $rowInput.val(numberOfRows);
        $tileSize.val(tileSize);
        $fastRender.prop('checked', optimizeRendering);

        /**
         * Detect new puzzle click
         */
        $newPuzzleButton.on('click', handleNewPuzzleButtonClick );

        function handleNewPuzzleButtonClick() {
            const columnInputValue = parseInt($columnInput.val(), 10);
            const rowInputValue = parseInt($rowInput.val(), 10);
            const tileSizeValue = parseInt($tileSize.val(), 10);
            const checkedValue = $fastRender.is(':checked');

            // double check to make sure we have numbers
            if (!isNaN(columnInputValue) && !isNaN(rowInputValue) && !isNaN(tileSizeValue)) {
                /** Put the new parameters in the query string and reload the window */
                window.location = window.location.origin + `/?numberOfColumns=${columnInputValue}&numberOfRows=${rowInputValue}&tileSize=${tileSizeValue}&optimizeRendering=${checkedValue}`;
            }
        }

        /**
         * Detect undo and redo
         */
        $(document).on('keydown', handleDocumentKeydown);

        function handleDocumentKeydown(e) {
            const event = e || window.event;

            const isInput = $(event.target).is("input");
            const charCode = (typeof event.which == "number") ? event.which : event.keyCode;
            if (charCode) {
                if (!isInput) {
                    switch (charCode) {
                        case 90:
                            // Ctrl-Shift-Z
                            if (e.ctrlKey && e.shiftKey) {
                                puzzleContainer.redo();
                            }
                            // Ctrl-Z
                            else if (e.ctrlKey) {
                                puzzleContainer.undo();
                            }
                            break;
                    }
                }
            }
        }
    }
);

