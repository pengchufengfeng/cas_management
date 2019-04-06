package com.jingxiang.common.service.impl;


import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jingxiang.common.dao.UserMapper;
import com.jingxiang.common.entity.User;
import com.jingxiang.common.service.CrudService;
import com.jingxiang.common.service.WxUserService;
import com.jingxiang.common.util.HttpUtil;


@Service
@Transactional
public class  WxUserServiceImpl extends CrudService<UserMapper,User> implements WxUserService {
    @Value("${wx.AppId}")
    private String appId;
    @Value("${wx.AppSecret}")
    private String appSecret;
    @Autowired
    private UserMapper userMapper;


    
    @Override
    public String getOpenId(String code) {
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid="+appId+"&secret="+appSecret+"&js_code="+code+"&grant_type=authorization_code";
        JSONObject re = HttpUtil.GetResult(url);
        //存入session_key和openid的关
        System.out.println(re.toString());
        String opendid = (String)re.get("openid");
        String sessionKey = (String)re.get("session_key");
        if (opendid==null){
            return null;
        }
        //查数据库判断是否是新用户
        User u = userMapper.checkExist(opendid);
        if(u==null){
            User user = new User();
            user.setOpenId(opendid);
            user.setSessionKey(sessionKey);
            user.setIsNewRecord(true);
            save(user);
            return user.getId();
        }else{
            return u.getId();
        }

    }
	@Override
	public void updateUser(User user) {
        user.setIsNewRecord(false);
        user.setModifier(user.getId());
		save(user);
	}

    @Override
    public User getUserById(String id) {
        return get(id);
    }


}
