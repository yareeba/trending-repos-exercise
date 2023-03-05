import RepositoryCard from "./RepositoryCard";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event"

const mockOnClickFavourite = jest.fn();
const mockRepository = {
  id: "1",
  name: "Test Repo",
  html_url: "https://www.github.com/test-repo",
  description: "Test Repository",
  stargazers_count: 400,
  language: "JavaScript",
  updated_at: "2023-03-04T22:15:17Z",
  created_at: "2023-01-18T23:32:32Z",
};
const mockProps = {
  repository: mockRepository,
  onClickFavourite: mockOnClickFavourite,
  isFavourite: false,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("RepositoryCard", () => {
  test("renders repository details", () => {
    render(<RepositoryCard {...mockProps} />);

    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      mockRepository.html_url
    );
    expect(screen.getByRole("link")).toHaveTextContent(mockRepository.name);
    expect(
      screen.getByText(mockRepository.stargazers_count)
    ).toBeInTheDocument();
    expect(screen.getByText(mockRepository.description)).toBeInTheDocument();
  });

  test("renders the repository language when it is there", () => {
    render(<RepositoryCard {...mockProps} />);

    expect(screen.queryByTestId("repo-language")).toBeInTheDocument()
  });

  test("does not render a repository language when it is null", () => {
    render(<RepositoryCard {...mockProps} repository={{...mockRepository, language: null }}/>);

    expect(screen.queryByTestId("repo-language")).not.toBeInTheDocument()
  })

  test("calls onClickFavourite when favourite button is clicked", async () => {
    const user = userEvent.setup()
    render(<RepositoryCard {...mockProps} />);

    const favouriteButton = screen.getByRole('button', { name: "Favourite" })
    await user.click(favouriteButton)

    expect(mockOnClickFavourite).toHaveBeenCalledTimes(1)
  });

  test("calls onClickFavourite when unfavourite button is clicked", async () => {
    const user = userEvent.setup()
    render(<RepositoryCard {...mockProps} isFavourite={true} />);

    const unfavouriteButton = screen.getByRole('button', { name: "Unfavourite" })
    await user.click(unfavouriteButton)

    expect(mockOnClickFavourite).toHaveBeenCalledTimes(1)
  });
});
