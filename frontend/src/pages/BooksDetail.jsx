"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteBook, getBookDetailById } from "../modules/fetch";

export default function BookDetails() {
  const [book, setBook] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookDetailById(id);
        setBook(response.book);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchBook();
  }, [id]);

  const handleDeleteBook = async () => {
    try {
      await deleteBook(id);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {isLoading ? (
            <Skeleton height="300px" my="6" />
          ) : (
            <Flex my="6">
              <Box w="300px">
                <Image
                  src={`http://localhost:8000/${book.image}`}
                  alt={book.title}
                  borderRadius="lg"
                  boxShadow="md"
                />
              </Box>
              <Box ml="8">
                <Heading as="h1" size="lg">
                  {book.title}
                </Heading>
                <Text fontSize="xl" fontWeight="semibold" color="gray.500">
                  {book.author}
                </Text>
                <Text fontSize="xl" fontWeight="semibold" color="gray.500">
                  {book.publisher}
                </Text>
                <Text
                  fontSize="xl"
                  fontWeight="semibold"
                  color="gray.500"
                  mb="4"
                >
                  {book.year} | {book.pages} pages
                </Text>
              </Box>
            </Flex>
          )}
          {localStorage.getItem("token") && (
            <HStack spacing={4}>
              <Popover>
                <PopoverTrigger>
                  <Button colorScheme="red">Delete</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Confirmation!</PopoverHeader>
                  <PopoverBody>
                    Are you sure you want to delete this book?
                  </PopoverBody>
                  <Button onClick={handleDeleteBook} colorScheme="red" m={4}>
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
              <Link to={`/editbook/${id}`}>
                <Button>Edit</Button>
              </Link>
            </HStack>
          )}
        </Box>
      </Stack>
    </Flex>
  );
}
