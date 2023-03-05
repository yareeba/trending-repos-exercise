import { Repository } from "@/types";
import { StarIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Link,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
} from "@chakra-ui/react";

interface RepositoryCardProps {
  repository: Repository;
  onClickFavourite: (r: Repository) => void;
  isFavourite: boolean;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  onClickFavourite,
  isFavourite,
}) => {
  return (
    <Card key={repository.id} variant="outline">
      <CardHeader>
        <Flex direction="row" gap={2}>
          <Heading as="h2" size="md">
            <Link
              href={repository.html_url}
              textDecoration="underline"
              isExternal
            >
              {repository.name}
            </Link>
          </Heading>
          <Tag colorScheme="yellow">
            <TagLabel>{repository.stargazers_count}</TagLabel>
            <TagRightIcon as={StarIcon} />
          </Tag>
          {repository.language && <Tag data-testid="repo-language">{repository.language}</Tag>}
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent="space-between" align="center">
          <Text>{repository.description}</Text>
          <IconButton
            aria-label={isFavourite ? "Unfavourite" : "Favourite"}
            colorScheme={isFavourite ? "green" : "gray"}
            icon={<StarIcon color={isFavourite ? "yellow" : "gray.500"} />}
            onClick={() => onClickFavourite(repository)}
          />
        </Flex>
      </CardBody>
    </Card>
  );
};

export default RepositoryCard;
