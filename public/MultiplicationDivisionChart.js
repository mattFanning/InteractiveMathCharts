class InteractiveMultiplicationTable { 
    constructor(parentTagId) {
        this.parentId = parentTagId
    }
    
    display() {
        $(this.parentId).append(`
            <h1>Interactive Multiplication Table</h1>
                <label class="mult_table_label">
                    <b>Dimensions:</b>
                    <input type="number" id="rowChoice" class = "mult_table_input" min="1" max="20" value = 10>
                    x
                    <input type="number" id="colChoice" class = "mult_table_input" min="1" max="20" value = 10>
                </label>
        `)

        var _this = this
        $('.mult_table_input').change(function() {
            _this.clear()
            _this.generateTable($('#rowChoice').val(), $('#colChoice').val())
        }).keypress(function (evt) {
            evt.preventDefault();
        })
    
        this.generateTable($('#rowChoice').val(), $('#colChoice').val())
    }

    generateTable(m, n) {
        if (m == 0 || n == 0) {
            return
        }
        
        //table
        $(this.parentId).append(`<table class="mult_table"></table>`)
        const $table = $('.mult_table')

        // add the header row
        $table.append(`<tr class="mult_table_header_row" data-row=0></tr>`)
        const $tableHeaderRow = $(`.mult_table_header_row`)
        
        $tableHeaderRow.append(`<th class=", mult_table_header_cell"></th>`)
        for(var j = 1; j <= n; j++) {
            $tableHeaderRow.append(`<th class=" mult_table_header_cell" data-row=0 data-col=${j}>${j}</th>`)
        }

        // fill the table
        for(var i = 1; i <= m; i++) {
            $table.append(`<tr class="mult_table_row" data-row="${i}"></tr>`)
            const $tableRow = $(`.mult_table_row[data-row=${i}]`)

            $tableRow.append(`<th class="mult_table_header_cell" data-row=${i} data-col=0>${i}</th>`)
            // fill the row
            for(var j = 1; j <= n; j++) {
                $tableRow.append(`<th class="" data-row=${i} data-col=${j}>
                    ${i * j}
                    
                </th>`)

                const $tableCell = $(`th[data-row=${i}][data-col="${j}"]`).not('.mult_table_header_cell');
                this.#setupHoverListenerFor($tableCell)
            }
        }
    }
  
    clear() {
        this.#clearTable()
        this.#clearEquations()
    }

    #clearTable() {
        $('.mult_table').remove()
    }

    #clearEquations() {
        $(this.equationsTableId).empty()
    }

    #setupHoverListenerFor($tableCell) {
        const _this  = this
        $tableCell.hover(function() {
            //highlight function
            const dataCol = $(this).attr("data-col")
            const dataRow = $(this).attr('data-row')
            console.log(`(${dataCol},${dataRow})`)

            const $colCellsToHighlight = $(`th[data-col=${dataCol}]`).filter(function() {
                const currentRowInt = parseInt($(this).attr("data-row"))
                const dataRowInt = parseInt(dataRow)
                return currentRowInt <= dataRowInt
            })
            
            const $rowCellsToHighlight = $(`th[data-row=${dataRow}]`).filter(function() {
                const currentColInt = parseInt($(this).attr("data-col"))
                const dataColInt = parseInt(dataCol)
                return currentColInt <= dataColInt
            })
            
            $colCellsToHighlight.addClass('hover')
            $rowCellsToHighlight.addClass('hover')
            const $currentCell = $(`th[data-col=${dataCol}][data-row=${dataRow}]`)
            $currentCell.addClass('hoverCell')
            $currentCell.append(`<span class="tooltiptext"></span>`)
            
            const $tooltip = $(`span`)
            _this.#generateEquations($tooltip, dataRow,dataCol)

            const yPos = $currentCell.offset().top + 50 + $tooltip.height() 
            console.log(`${yPos} vs ${$(window).height()}`)
            if(yPos - $(document).scrollTop() >= $(window).height()) {
                console.log("using top-right")
                $tooltip.addClass('tooltip_topright').css('top', -1 * ($tooltip.height())) 
            }
        }, function() {
            //clear highlight funtion
            $('.hover').removeClass('hover')
            $('.hoverCell').removeClass('hoverCell')
            $('.tooltiptext').remove()
            _this.#clearEquations()
        })
    }

    #generateEquations($parent, int1, int2) {
        const result = int1 * int2
        if(int1 != int2){
            $parent
            .append(`<b>${int1} x ${int2} = ${result} </b>`)
            .append(`<hr>`)
            .append(`<b>${int2} x ${int1} = ${result} </b>`)
            .append(`<hr style="border-top: 3px solid black">`)
            .append(`<b>${result} &#x00F7; ${int1} = ${int2} </b>`)
            .append(`<hr>`)
            .append(`<b>${result} &#x00F7; ${int2} = ${int1} </b>`)
        } else {
            $parent
            .append(`<b>${int1} x ${int2} = ${result} </b>`)
            .append(`<hr style="border-top: 3px solid black">`)
            .append(`<b>${result} &#x00F7; ${int1} = ${int2} </b>`)
        }
        
    }
}



// script execution
const interactiveMultTable = new InteractiveMultiplicationTable("#mb_table_div").display()
