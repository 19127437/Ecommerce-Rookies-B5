package com.example.ecommerce_rookies.controllers;


import com.example.ecommerce_rookies.exception.account.NotFoundAccount;
import com.example.ecommerce_rookies.exception.product.NotFoundProductByCategory;
import com.example.ecommerce_rookies.modelDTO.ProductCommentDTO;
import com.example.ecommerce_rookies.modelDTO.RattingDTO;
import com.example.ecommerce_rookies.models.Account;
import com.example.ecommerce_rookies.models.Product;
import com.example.ecommerce_rookies.models.ProductComment;
import com.example.ecommerce_rookies.repository.ProductCommentRepository;
import com.example.ecommerce_rookies.repository.ProductRepository;
import com.example.ecommerce_rookies.services.AccountService;
import com.example.ecommerce_rookies.services.ProductCommentService;
import com.example.ecommerce_rookies.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/auth/productcomment")
public class ProductCommentController {

    @Autowired
    private ProductCommentRepository productCommentRepository;

    @Autowired
    private ProductCommentService productCommentService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;


    @GetMapping("/{id}")
    public ResponseEntity<?> getProductCommentById(@PathVariable Long id){
        Optional<ProductComment> productComment = productCommentRepository.findById(id);
        RattingDTO rattingDTO = productCommentService.convertDTO(productComment.get());
        return ResponseEntity.ok().body(rattingDTO);

    }
    @GetMapping()

    public List<ProductComment> getProductComments(){
//        return productCommentService.convertListDTO(productCommentService.getProductCommentList());
        return productCommentRepository.findAll();
    }

    @PostMapping()
    public ResponseEntity<?> createProductComment(@RequestBody ProductCommentDTO productCommentDTO){
        ProductComment productComment = new ProductComment();
        Optional<Account> account = accountService.getAccountId(Long.valueOf(productCommentDTO.getId_account()));
        Optional<Product> product = productService.getProductById(Long.valueOf(productCommentDTO.getId_product()));
        if(account.isEmpty())
            throw  new NotFoundAccount(Long.valueOf(productCommentDTO.getId_account()));
        if(product.isEmpty())
            throw new NotFoundProductByCategory.NotFoundProduct(Long.valueOf(productCommentDTO.getId_product()));
        Set<ProductComment> productComments = product.get().getProductComments();
        for (ProductComment productComment1 : productComments) {
           if(productComment1.getAccount().getId() == Long.parseLong(productCommentDTO.getId_account())){
               throw new NotFoundAccount.ExitsAccount(Long.parseLong(productCommentDTO.getId_account()));
           }
        }
        productComment.setAccount(account.get());
        productComment.setRating(productCommentDTO.getRating());
        productComment.setComment(productCommentDTO.getComment());
        Float ratting = product.get().getRatting();
        ratting = (ratting + productComment.getRating())/(product.get().getProductComments().size() +1);
        product.get().setRatting(ratting);
        productRepository.save(product.get());
        productComment.setProduct(product.get());
        productCommentRepository.save(productComment);
        RattingDTO rattingDTO = productCommentService.convertDTO(productComment);
        return ResponseEntity.ok().body(rattingDTO);
    }
}