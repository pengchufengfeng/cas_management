package com.bucg.sso.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


/** 
* @author lutong
* @Date：2017年5月22日 下午3:43:42 
* 
*/ 
@Component
public class InitCORSFilter extends OncePerRequestFilter {
 
 
    /**
     * 解决跨域：Access-Control-Allow-Origin，值为*表示服务器端允许任意Domain访问请求
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
    //	String url = request.getRequestURI();
 /*   	
		if(url.endsWith(".html")&&!url.contains("Login.html")){
			HttpSession session = request.getSession();
			User user=(User)session.getAttribute(UserConstant.USER);
			if(user==null){
				response.sendRedirect("/Login.html");
			}
			
		}*/
            response.addHeader("Access-Control-Allow-Origin",request.getHeader("Origin"));
            response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.addHeader("Access-Control-Allow-Headers", "origin, content-type, accept, x-requested-with, sid, mycustom, smuser");
            response.addHeader("Access-Control-Max-Age", "1800");//30 min
            response.addHeader("Access-Control-Allow-Credentials", "true");
      
        filterChain.doFilter(request, response);
    }
     

}

