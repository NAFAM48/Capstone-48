package com.knust.toyfactory.toy_factory_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AuthSignupRequest", description = "Payload for user registration")
public class AuthSignupRequest {

    @Schema(description = "Email address of the new user", example = "user@example.com")
    private String email;

    @Schema(description = "Password for the new account", example = "Secret123!")
    private String password;

    @Schema(description = "Role assigned to the user", example = "OPERATOR", allowableValues = {"OPERATOR", "MANAGER"})
    private String role;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
