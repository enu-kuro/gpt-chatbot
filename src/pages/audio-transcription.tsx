import React, { useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const AudioTranscription = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const sizeLimit = 1 * 1024 * 1024; // 1 MB

      if (selectedFile.size > sizeLimit) {
        alert("File size exceeds 1 MB. Please choose a smaller file.");
        return;
      }
    }

    setFile(selectedFile || null);
  };

  const handleChooseFileClick = () => {
    inputFileRef.current?.click();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    console.log(file.name);
    try {
      const response = await axios.post("/api/whisper", formData);
      console.log(response.data);
      setResult(response.data.text);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <Box
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      borderRadius="md"
      overflow="hidden"
      width={{ base: "100%", md: "600px" }}
      margin="0 auto"
      mt={4}
      p={4}
    >
      <form onSubmit={handleSubmit}>
        <FormControl id="file" mt={4}>
          <FormLabel>Select an audio file:</FormLabel>
          <Input
            ref={inputFileRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            display="none"
          />
          <Button onClick={handleChooseFileClick}>Choose File</Button>
          {file && <Text ml={2}>{file.name}</Text>}
        </FormControl>
        <Button
          mt={4}
          type="submit"
          colorScheme="blue"
          isDisabled={!file || loading}
        >
          Transcript
        </Button>
      </form>
      {loading && (
        <Box mt={4}>
          <Spinner size="lg" />
          <Text ml={2} display="inline-block">
            Loading...
          </Text>
        </Box>
      )}
      {result && (
        <Box mt={4}>
          <Text fontWeight="bold">Result:</Text>
          <Text>{result}</Text>
        </Box>
      )}
    </Box>
  );
};

export default AudioTranscription;
