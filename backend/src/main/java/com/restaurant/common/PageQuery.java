package com.restaurant.common;

/**
 * 分页查询参数
 */
public class PageQuery {
    private Integer pageNum = 1;
    private Integer pageSize = 10;
    private String keyword;
    
    // Getters and Setters
    public Integer getPageNum() {
        return pageNum;
    }
    
    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }
    
    public Integer getPageSize() {
        return pageSize;
    }
    
    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
    
    public String getKeyword() {
        return keyword;
    }
    
    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
}