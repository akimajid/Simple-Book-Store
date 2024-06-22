"use client";

import {
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  useToast,
  VStack,
  Heading,
  Flex,
  Box,
  Stack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createBook, editBook } from "../modules/fetch";

export default function BookForm({ bookData }) {
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const formData = new FormData(event.target);
    if (bookData) {
      try {
        await editBook(
          bookData.id,
          formData.get("title"),
          formData.get("author"),
          formData.get("publisher"),
          parseInt(formData.get("year")),
          parseInt(formData.get("pages"))
        );
        toast({
          title: "Success",
          description: "Book edited successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.response.data.message || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      return;
    }
    try {
      await createBook(formData);
      event.target.reset();
      toast({
        title: "Success",
        description: "Book created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setSelectedImage("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    if (bookData?.image) {
      setSelectedImage(`http://localhost:8000/${bookData?.image}`);
    }
  }, [bookData]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            {bookData ? "Edit Book" : "Add New Book Here"}
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input name="title" required defaultValue={bookData?.title} />
              </FormControl>
              <FormControl>
                <FormLabel>Author</FormLabel>
                <Input name="author" required defaultValue={bookData?.author} />
              </FormControl>
              <FormControl>
                <FormLabel>Publisher</FormLabel>
                <Input
                  name="publisher"
                  required
                  defaultValue={bookData?.publisher}
                />
              </FormControl>
              <HStack>
                <Box>
                  <FormControl>
                    <FormLabel>Year</FormLabel>
                    <Input
                      name="year"
                      type="number"
                      required
                      defaultValue={bookData?.year}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl>
                    <FormLabel>Pages</FormLabel>
                    <Input
                      name="pages"
                      type="number"
                      required
                      defaultValue={bookData?.pages}
                    />
                  </FormControl>
                </Box>
              </HStack>
              {selectedImage && (
                <Image w={64} src={selectedImage} alt="Selected Image" />
              )}
              {!bookData?.image && (
                <FormControl>
                  <FormLabel>Image</FormLabel>
                  <Input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setSelectedImage(URL.createObjectURL(file));
                    }}
                  />
                </FormControl>
              )}
              <Button
                type="submit"
                loadingText={bookData ? "Editing" : "Submitting"}
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                {bookData ? "Edit Book" : "Create Book"}
              </Button>
            </VStack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
