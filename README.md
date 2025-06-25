# Project: Cloud-Based Notes App

This project is a `React` application which allows users to create, view, and manage notes with optional file attachments. It uses multiple AWS services for storage and back-end functionality.

## Technologies Used
### Front-End
* `HTML5`
* `CSS3`
* `JavaScript (ES6)`
* `React`
* `React Router`
* `Styled Components`
### Back-End
* `DynamoDB`
* `S3`
* `Lambda`
* `API Gateway`
* `IAM`


## Core Features
* **Note managment**: Add, view, delete notes with title, description, and optional image attachments.
* **Responsive design**: Fully adaptable to different screen sizes.
* **Cloud-Native Back-End**: Fully cloud-hosted, serverless back-end architecture through AWS services.

## Setup Overview
Here are the steps followed to build the back-end architecture using AWS services:
### `DynamoDB` Table
I added a `notes` table with the following fields:

* **Partition Key**: `NoteID` (String)
  * `NoteID` (partition key)
  * `Title`
  * `Content`
  * `CreatedAt`
  * `FileURL`

### `S3` Bucket
I created `notes-app-attachments`, a public S3 bucket for storing image attachments. I enabled CORS policy for cross-origin permissions and public read access for properly displaying saved objects.

### `Lambda` Functions
I created the following `Lambda` functions, each of them connecting to `DynamoDB` and/or `S3` and returning `JSON` responses:

1. `createNote()` — Stores the note and optional file to DynamoDB and S3:
    ```js
    import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
    import { PutCommand } from "@aws-sdk/lib-dynamodb";
    import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
    import { v4 as uuidv4 } from "uuid";

    const ddb = new DynamoDBClient({});
    const s3 = new S3Client({});
    const TABLE_NAME = "notes";
    const BUCKET_NAME = "csa-project-notes-app-attachments";

    export const handler = async (event) => {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      };

      if (event.httpMethod === "OPTIONS") {
        return {
          statusCode: 200,
          headers: {
            ...headers,
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
          },
          body: ""
        };
      }

      try {
        const body = JSON.parse(event.body);
        const noteID = uuidv4();
        const createdAt = new Date().toISOString();
        let fileURL = null;

        if (body.file && body.fileName) {
          const buffer = Buffer.from(body.file, "base64");
          await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `${noteID}/${body.fileName}`,
            Body: buffer,
            ContentType: body.contentType,
          }));
          fileURL = `https://${BUCKET_NAME}.s3.amazonaws.com/${noteID}/${body.fileName}`;
        }

        await ddb.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            NoteID: noteID,
            Title: body.title,
            Content: body.content,
            CreatedAt: createdAt,
            FileURL: fileURL,
          },
        }));

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ message: "Note created", noteID }),
        };
      } catch (err) {
        console.error("Error:", err);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: "Internal Server Error", error: err.message }),
        };
      }
    };
    ```

2. `getAllNotes()` — Returns all notes:
    ```javascript
    import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
    import { ScanCommand } from "@aws-sdk/lib-dynamodb";

    const ddb = new DynamoDBClient({});
    export const handler = async (event) => {
      const result = await ddb.send(new ScanCommand({ TableName: "notes" }));
      return {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    };
    ```

3. `getNoteById()` — Returns a single note using its `NoteID` value:
    ```javascript
    import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
    import { GetCommand } from "@aws-sdk/lib-dynamodb";

    const ddb = new DynamoDBClient({});
    export const handler = async (event) => {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      };

      const noteID = event?.pathParameters?.id;

      if (!noteID) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing note ID in path" }),
        };
      }

      try {
        const result = await ddb.send(new GetCommand({
          TableName: "notes",
          Key: { NoteID: noteID }
        }));

        return {
          statusCode: result.Item ? 200 : 404,
          headers,
          body: JSON.stringify(result.Item || { error: "Note not found" }),
        };
      } catch (err) {
        console.error("DynamoDB error:", err);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Database error", details: err.message }),
        };
      }
    };
    ```


4. `deleteNote()` — Deletes the note and optional file (if any):
    ```js
    import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
    import { GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
    import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

    const ddb = new DynamoDBClient({});
    const s3 = new S3Client({});
    const BUCKET_NAME = "csa-project-notes-app-attachments";

    export const handler = async (event) => {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      };

      const noteID = event?.pathParameters?.id;

      if (!noteID) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing note ID in path" }),
        };
      }

      try {
        const { Item } = await ddb.send(new GetCommand({
          TableName: "notes",
          Key: { NoteID: noteID },
        }));

        if (Item?.FileURL) {
          const key = Item.FileURL.split(`.com/`)[1];
          await s3.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          }));
        }

        await ddb.send(new DeleteCommand({
          TableName: "notes",
          Key: { NoteID: noteID },
        }));

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: "Note deleted" }),
        };
      } catch (err) {
        console.error("Error deleting note:", err);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Failed to delete note", details: err.message }),
        };
      }
    };
    ```

### API Gateway Architecture
I built a REST API and configured the following resources/method, mapping their corresponding Lambda function:

* `GET /`  → `getAllNotes()`
* `POST /note` → `createNote()`
* `GET /notes/{id}` → `getNoteById()`
* `DELETE /notes/{id}` → `deleteNote()`

I made sure to enable `CORS` for the integrated requests to all the endpoints and deployed the finalized API to the `dev` stage.

### IAM & Permissions
I created a specific IAM user (`csa-project-notes-app-user`) and policy (`notes-app-policy`) for this projct, allowing it to view, add, and update data in `S3`/`DynamoDB` instances, but prohibiting any unrelated view access or object deletion. Here is the policy implemented in `JSON` format:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets",
                "dynamodb:ListTables",
                "dynamodb:Scan"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucketMultipartUploads",
                "dynamodb:PutItem",
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "s3:GetBucketCORS",
                "dynamodb:UpdateItem",
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": [
                "arn:aws:dynamodb:*:975050366331:table/notes",
                "arn:aws:s3:::csa-project-notes-app-attachments",
                "arn:aws:s3:::csa-project-notes-app-attachments/*"
            ]
        }
    ]
}
```

## Getting Started
1. **Clone the repository:**
```bash
git clone https://github.com/adrian-cr/csa-project-notes-app.git
cd csa-project-notes-app
```
2. **Install dependencies:**
```bash
npm install
```
3. **Start the development server:**
```bash
npm start
```
This will open the app at [http://localhost:3000](http://localhost:3000) in your browser.
