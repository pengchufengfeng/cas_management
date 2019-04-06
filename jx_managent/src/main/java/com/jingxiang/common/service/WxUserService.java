package com.jingxiang.common.service;


import com.jingxiang.common.entity.User;

public interface WxUserService {
    String getOpenId(String code);
    void updateUser(User user);
    User getUserById(String id);
}

