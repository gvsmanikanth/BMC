package com.bmc.servlets;

import com.bmc.util.StringHelper;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import javax.jcr.Session;
import javax.servlet.http.Cookie;
import java.io.IOException;

@SlingServlet(resourceTypes = "auth-redirect", methods = {"GET"})
public class RedirectingAuthenticatorServlet extends SlingSafeMethodsServlet {
    private static final String RETURN_URL_PARAM = "rurl";
    private static final String DEFAULT_RETURN_URL = "/";
    private static final String AUTH_COOKIE="login-token";
    private static final String MANUAL_LOGIN_URL_FORMAT="/libs/granite/core/content/login.html?resource=%s&$$login$$=%24%24login%24%24&j_reason=unknown&j_reason_code=unknown";

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("text/html");

        Resource parentResource = request.getResource().getParent();
        String action = (parentResource == null) ? "" : parentResource.getName();

        switch (action) {
            case "login":
                doLogin(request, response);
                break;
            case "logout":
                doLogout(request, response);
                break;
            default:
                response.sendError(404);
                break;
        }
    }

    private void doLogin(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String returnUrl = getReturnUrl(request);
        if (isLoggedIn(request))
            response.sendRedirect(returnUrl);
        else
            response.sendRedirect(String.format(MANUAL_LOGIN_URL_FORMAT, returnUrl));
    }

    private void doLogout(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        if (isLoggedIn(request))
            removeCookie(response, AUTH_COOKIE);
        response.sendRedirect(getReturnUrl(request));
    }

    private String getReturnUrl(SlingHttpServletRequest request) {
        String url = StringHelper.resolveHref(request.getParameter(RETURN_URL_PARAM))
                .orElse(DEFAULT_RETURN_URL);
        if (!(url.startsWith("/") || url.startsWith("http") || url.startsWith("#")))
            url = "/" + url;

        return url;
    }

    private boolean isLoggedIn(SlingHttpServletRequest request) {
        Session session = request.getResourceResolver().adaptTo(Session.class);
        return (session != null && !session.getUserID().equals("anonymous"));
    }

    private void removeCookie(SlingHttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
