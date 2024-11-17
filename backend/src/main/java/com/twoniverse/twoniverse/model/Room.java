package com.twoniverse.twoniverse.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String password;

    @ElementCollection
    private List<String> invites;

    @ManyToOne
    private User owner;

    @Column(nullable = false)
    private LocalDateTime creationTime;
}
