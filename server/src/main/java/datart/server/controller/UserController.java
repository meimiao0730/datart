/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package datart.server.controller;

import datart.core.base.annotations.SkipLogin;
import datart.core.base.consts.Const;
import datart.core.base.consts.UserIdentityType;
import datart.core.entity.ext.UserBaseInfo;
import datart.security.base.PasswordToken;
import datart.server.base.dto.ResponseData;
import datart.server.base.dto.UserProfile;
import datart.server.base.params.ChangeUserPasswordParam;
import datart.server.base.params.UserRegisterParam;
import datart.server.base.params.UserResetPasswordParam;
import datart.server.base.params.UserUpdateParam;
import datart.server.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.util.List;


@Api
@Slf4j
@RestController
@RequestMapping(value = "/users")
public class UserController extends BaseController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @SkipLogin
    @ApiOperation(value = "User registration")
    @PostMapping("/register")
    public ResponseData<Boolean> register(@Validated @RequestBody UserRegisterParam user) throws MessagingException, UnsupportedEncodingException {
        return ResponseData.success(userService.register(user));
    }

    @ApiOperation(value = "Search users by keyword")
    @GetMapping("/search")
    public ResponseData<List<UserBaseInfo>> listUsersByKeyword(@RequestParam("keyword") String keyword) {
        return ResponseData.success(userService.listUsersByKeyword(keyword));
    }

    @ApiOperation(value = "get user detail")
    @GetMapping
    public ResponseData<UserProfile> getUserProfile() {
        return ResponseData.success(userService.getUserProfile());
    }

    @SkipLogin
    @ApiOperation(value = "Activate the user")
    @GetMapping(value = "/active")
    public ResponseData<String> activate(@RequestParam("token") String activeToken) {
        checkBlank(activeToken, "activeToken");
        return ResponseData.success(userService.activeUser(activeToken));
    }


    @ApiOperation(value = "send email")
    @PostMapping(value = "/sendmail")
    @SkipLogin
    public ResponseData<Boolean> sendEmail(String usernameOrEmail) throws UnsupportedEncodingException, MessagingException {
        return ResponseData.success(userService.sendActiveMail(usernameOrEmail));
    }

    @ApiOperation(value = "update user info")
    @PutMapping
    public ResponseData<Boolean> updateUser(@Validated @RequestBody UserUpdateParam userUpdateParam) {
        return ResponseData.success(userService.update(userUpdateParam));
    }

    @ApiOperation(value = "change user password")
    @PutMapping("/change/password")
    public ResponseData<Boolean> changePassword(@Validated @RequestBody ChangeUserPasswordParam userPassword) {
        return ResponseData.success(userService.changeUserPassword(userPassword));
    }


    @ApiOperation(value = "forget password")
    @PutMapping("/reset/password")
    @SkipLogin
    public ResponseData<Boolean> resetPassword(@Validated @RequestBody UserResetPasswordParam passwordParam) {
        return ResponseData.success(userService.resetPassword(passwordParam));
    }

    @SkipLogin
    @ApiOperation(value = "User Login")
    @PostMapping(value = "/login")
    public ResponseData<UserBaseInfo> login(@RequestParam(required = false) String username,
                                            @RequestParam(required = false) String password,
                                            HttpServletResponse response) {
        PasswordToken passwordToken = new PasswordToken(username, password, System.currentTimeMillis());
        String token = userService.login(passwordToken);
        response.setHeader(Const.TOKEN, token);
        return ResponseData.success(new UserBaseInfo(securityManager.getCurrentUser()));

    }

    @ApiOperation(value = "User Login")
    @PostMapping(value = "/forget/password")
    @SkipLogin
    public ResponseData<String> forgetPassword(@RequestParam(required = false) UserIdentityType type,
                                               @RequestParam(required = false) String principal) {
        return ResponseData.success(userService.forgetPassword(type, principal));
    }

}