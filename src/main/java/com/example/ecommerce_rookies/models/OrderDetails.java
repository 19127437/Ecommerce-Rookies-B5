package com.example.ecommerce_rookies.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name="orderDetails")
public class OrderDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "price")
    private float price;

    @Column(name= "quantity")
    private int number;

    @ManyToOne
    @JoinColumn(name="idOrders")
    @JsonIgnore
    private Cartmodel cartmodel;
//
    @OneToOne
    @JoinColumn(name = "product_id" )
    @JsonIgnore
    private Product product;

}
