package com.jingxiang.common.util;

import com.google.gson.Gson;
import com.jingxiang.common.entity.UserDetails;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * The type Token util.
 *
 * @author jingpeng
 */
@Component
@ConfigurationProperties("security.jwt")
public class TokenUtil extends AbstractTokenUtil {

    @Override
    public UserDetails getUserDetails(String token) {
        String userDetailsString = getUserDetailsString(token);
        if (userDetailsString != null) {
            return new Gson().fromJson(userDetailsString,UserDetails.class);
        }
        return null;
    }

    public static void main(String[] args) {
        String value="{\"accountNonExpired\":true,\"accountNonLocked\":true,\"authorities\":[{\"authority\":\"ROLE_ADMIN\"},{\"authority\":\"ROLE_USER\"},{\"authority\":\"trip:dashboard:view\"},{\"authority\":\"trip:user:view\"},{\"authority\":\"trip:user:edit\"},{\"authority\":\"sys:menu:view\"},{\"authority\":\"sys:user:view\"},{\"authority\":\"sys:role:view\"},{\"authority\":\"sys:data:view\"},{\"authority\":\"sys:menu:edit\"},{\"authority\":\"sys:user:edit\"},{\"authority\":\"sys:role:edit\"}],\"credentialsNonExpired\":true,\"department\":\"行政部\",\"departmentId\":\"5\",\"email\":\"heiker@trojo.com\",\"enabled\":true,\"id\":\"1\",\"loginName\":\"admin\",\"password\":\"7c4a8d09ca3762af61e59520943dc26494f8941b\",\"phone\":\"13800138000\",\"position\":\"软件工程师\",\"positionId\":\"9\",\"realName\":\"admin\",\"salt\":\"\",\"username\":\"admin\"}";
        new Gson().fromJson(value,UserDetails.class);
        System.out.println("--");
    }
}