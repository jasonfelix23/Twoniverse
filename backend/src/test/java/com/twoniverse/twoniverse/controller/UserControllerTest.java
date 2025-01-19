package com.twoniverse.twoniverse.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.twoniverse.twoniverse.service.UserService;
import com.twoniverse.twoniverse.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity; // Import statement added
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashMap;
import java.util.Map;

public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Mock
    private JwtUtil jwtUtil;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    public void testUpdateName_ValidToken() throws Exception {
        String token = "valid.token.here";
        String username = "testUser";
        String newName = "newName";

        Map<String, String> request = new HashMap<>();
        request.put("newName", newName);

        when(jwtUtil.validateToken(token)).thenReturn(username);
        when(userService.updateName(eq(username), eq(newName))).thenReturn(ResponseEntity.ok("Name updated successfully"));

        mockMvc.perform(put("/api/v1/user/update-name")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"newName\":\"" + newName + "\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Name updated successfully"));
    }

    @Test
    public void testUpdateName_InvalidToken() throws Exception {
        String token = "invalid.token.here";

        Map<String, String> request = new HashMap<>();
        request.put("newName", "newName");

        when(jwtUtil.validateToken(token)).thenReturn(null);

        mockMvc.perform(put("/api/v1/user/update-name")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"newName\":\"newName\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid token"));
    }
}
