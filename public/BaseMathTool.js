class BaseMathTool {
        constructor(parentTagId) {
            this.parentId = parentTagId
        }

        display() {
            console.log("display called from parent class")
        }
}

export default BaseMathTool