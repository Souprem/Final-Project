# Design

## UML Class Diagram

```mermaid
classDiagram
    %% Inheritance Relationship
    User <|-- Moderator : Inherits

    %% Composition Relationship
    User *-- Profile : Has (1)

    %% Associations
    User "1" --> "*" Tweet : Authors
    User --> "*" User : Follows
    User --> "*" Tweet : Likes

    %% Self-Reference (Replies)
    Tweet "1" --> "*" Tweet : Replies (parent)

    %% Dependency/Association
    Tweet --> "0..1" Media : Contains

    class User {
        +String _id
        +String username
        +String email
        +String password
        +String role
        +String profilePic
        +Date createdAt
        +register()
        +login()
        +follow(User)
    }

    class Moderator {
        +String[] assignedSections
        +Number adminLevel
        +deleteAnyTweet()
        +banUser()
    }

    class Profile {
        +String bio
        +String location
        +String website
    }

    class Tweet {
        +String _id
        +String content
        +String mediaId
        +String mediaUrl
        +Date createdAt
        +like(User)
        +reply(Tweet)
    }

    class Media {
        +String type
        +String url
        +String sourceId
    }
```

## Data Model Description

1.  **User**: The central entity representing a registered account. Contains authentication data (email, password) and social graph connections (followers/following).
2.  **Moderator**: A specialized type of User (implemented via Discriminators) with elevated privileges and additional attributes like `assignedSections`.
3.  **Profile**: An embedded component of the User entity containing display information like bio and location.
4.  **Tweet**: The primary domain object representing a post. Relationships include:
    -   **Author**: The User who created it.
    -   **Parent**: A reference to another Tweet if it is a reply.
    -   **Likes**: A list of Users who liked the content.
5.  **Media**: Represents attached content (images/GIFs) within a Tweet, often linked to external sources (giphy, cloudinary).
