package com.example.products;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductController.class)
@Import(CorsConfig.class)
class ProductControllerTests {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    ProductRepository repository;

    @Test
    void listsProducts() throws Exception {
        when(repository.findAllByOrderByIdAsc()).thenReturn(List.of(new Product("P1")));

        mvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("P1"));
    }

    @Test
    void createsProduct() throws Exception {
        when(repository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        mvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\" P1 \"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("P1"));
    }

    @Test
    void rejectsBlankName() throws Exception {
        mvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"  \"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void allowsFrontendOrigin() throws Exception {
        when(repository.findAllByOrderByIdAsc()).thenReturn(List.of());

        mvc.perform(get("/api/products").header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
    }
}
