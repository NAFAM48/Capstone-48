package com.knust.toyfactory.toy_factory_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AuthSigninRequest", description = "Payload for user authentication")
public class AuthSigninRequest {

    @Schema(description = "Email address used for sign in", example = "user@example.com")
    private String email;

    @Schema(description = "Password for the user account", example = "Secret123!")
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
