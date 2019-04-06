package com.jingxiang.common.controller.wxUser;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import com.jingxiang.common.dao.UserMapper;
import com.jingxiang.common.entity.User;
import com.jingxiang.common.service.WxUserService;
import com.jingxiang.common.util.TokenUtil;


@RestController
@RequestMapping("/wx")
@Api(value = "",description = "微信授权登录模块")
public class XwUserController {
    @Value("${wx.AppId}")
    private String appId;
    @Value("${wx.AppSecret}")
    private String appSecret;
    @Autowired
    private TokenUtil tokenUtil;
    @Autowired
    private WxUserService wxUserService;
    @Autowired
    private UserMapper userMapper;



    @ApiOperation(value="新增用户", notes="获取code后 获得openId 和sessionKey 返回openId（后期用TOKEN加redis）给前端用于识别个人信息",httpMethod="POST")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "code", value = "code",paramType="query", required = true, dataType = "String")
    })
    
    
    @PostMapping(value = "/getCode")
    public String getCode(@RequestParam("code") String code) {  
        return wxUserService.getOpenId(code);
    }

    
    //更新用户信息，如头像和网名
    @PostMapping(value = "/updateUser")
    public void updateUser(@RequestBody User user) {
    	wxUserService.updateUser(user);
    }
    
    //根据用户id查询user
    @GetMapping("/getUserById")
    public User getUserById(@RequestParam("id") String id) {
    	return wxUserService.getUserById(id);
    }

}