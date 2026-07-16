module.exports = (query,countData)=>{
    let objectPagination = {
        currentPage:1,
        limitPage:4,
        skipPage:null,
        totalPage:null,
    }
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }
    if(query.limit){
        objectPagination.limitPage = parseInt(query.limit);
    }
    objectPagination.skipPage = (objectPagination.currentPage - 1)*objectPagination.limitPage;
    objectPagination.totalPage = Math.ceil(countData/objectPagination.limitPage);
    return objectPagination;
}