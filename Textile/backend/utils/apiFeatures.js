class Apifeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        this.query.find({ ...keyword })
        return this;
    }
    filter() {
        const queryStrCopy = { ...this.queryStr }
        const removeStr = ['keyword', 'limit', 'page']
        removeStr.forEach(field => delete queryStrCopy[field])

        let queryStr = JSON.stringify(queryStrCopy)
         queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr))
        return this;
    }
    paginate(resultpage){
        const currentpage=Number(this.queryStr.page) ||1
        const skip=resultpage*(currentpage-1)
        this.query.limit(resultpage).skip(skip)
        return this
    }
}
module.exports = Apifeatures