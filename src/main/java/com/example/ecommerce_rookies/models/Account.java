package com.example.ecommerce_rookies.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name="account")
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name="password")
    private String password;

    @NotBlank
    @Size(min = 3, max = 100)
    private String username;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "roleId",nullable = false)
    private Roles roles;

    @Column(name="activity")
    private boolean check_Account ;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "account")
    private Set<ProductComment> productComment;

    @OneToMany(mappedBy = "account",cascade = CascadeType.ALL)
    private Set<BanUser> banUsers;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "account")
    private Set<OrdersModel> ordersModels;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "account")
    private Set<Cartmodel> cartmodels;

    public Account(String password, String username) {
        this.password = password;
        this.username = username;
    }
}
