package com.knust.toyfactory.toy_factory_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AuthResponse", description = "Authentication response payload")
public class AuthResponse {

    @Schema(description = "Status message for the authentication action", example = "Login successful")
    private String message;

    @Schema(description = "Email address of the authenticated user", example = "user@example.com")
    private String email;

    @Schema(description = "Role assigned to the authenticated user", example = "OPERATOR")
    private String role;

    public AuthResponse() {}

    public AuthResponse(String message, String email, String role) {
        this.message = message;
        this.email = email;
        this.role = role;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
