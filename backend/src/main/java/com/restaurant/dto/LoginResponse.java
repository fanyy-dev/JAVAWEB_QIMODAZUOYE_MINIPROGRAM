package com.restaurant.dto;

/**
 * 登录响应DTO
 */
public class LoginResponse {
    private String token;
    private UserInfo userInfo;

    public static class UserInfo {
        private Long id;
        private String username;
        private String nickname;
        private String avatar;
        private String phone;
        private String userType;
        private String memberLevel;
        private Integer points;
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getNickname() {
            return nickname;
        }
        
        public void setNickname(String nickname) {
            this.nickname = nickname;
        }
        
        public String getAvatar() {
            return avatar;
        }
        
        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }
        
        public String getPhone() {
            return phone;
        }
        
        public void setPhone(String phone) {
            this.phone = phone;
        }
        
        public String getUserType() {
            return userType;
        }
        
        public void setUserType(String userType) {
            this.userType = userType;
        }
        
        public String getMemberLevel() {
            return memberLevel;
        }
        
        public void setMemberLevel(String memberLevel) {
            this.memberLevel = memberLevel;
        }
        
        public Integer getPoints() {
            return points;
        }
        
        public void setPoints(Integer points) {
            this.points = points;
        }
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserInfo getUserInfo() {
        return userInfo;
    }
    
    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }
}