# Mobile PDF Upload & Sign App

A mobile-friendly web application that allows users to upload PDF files, send them to a mock server for signing, and view the signed PDF on their device.

## Features

- 📱 **Mobile-First Design**: Optimized for mobile devices with touch-friendly UI
- 📄 **PDF Upload**: Drag-and-drop or file picker for PDF uploads
- ✍️ **Mock Signing**: Simulates PDF signing process with a 2-second delay
- 👁️ **PDF Viewer**: Built-in PDF viewer to display signed documents
- 💾 **Download**: Download signed PDFs directly to your device
- ✅ **File Validation**: Validates file type (PDF only) and size (max 10MB)

## Project Structure

```
mobile-pdf-upload-sign/
├── client/          # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx  # Main application component
│   │   └── ...
│   └── ...
└── server/          # Express.js backend
    ├── index.js     # Mock signing server
    └── ...
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup & Installation

### 1. Install Client Dependencies

```bash
cd client
npm install
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

## Running the Application

### Start the Server

In the `server` directory:

```bash
npm start
```

The server will run on `http://localhost:5000`

### Start the Client

In the `client` directory (in a new terminal):

```bash
npm run dev
```

The client will typically run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. **Upload PDF**: 
   - Click "Choose File" button or drag and drop a PDF file into the upload area
   - Only PDF files under 10MB are accepted

2. **Signing Process**:
   - The PDF is sent to the mock server
   - A loading spinner shows while the server processes the file (2-second delay)

3. **View Signed PDF**:
   - Once signed, the PDF is displayed in an embedded viewer
   - You can scroll and zoom within the viewer

4. **Download or Upload Another**:
   - Click "Download Signed PDF" to save the file
   - Click "Upload Another PDF" to start over

## Mobile Testing

To test on a mobile device:

1. Make sure both client and server are running
2. Find your computer's local IP address (e.g., `192.168.1.100`)
3. Create a `.env` file in the `client` directory with:
   ```
   VITE_API_URL=http://YOUR_IP:5000
   ```
   Or update the API_URL constant in `client/src/App.tsx` directly.
4. Restart the client dev server if you changed the `.env` file
5. Access the app from your mobile device's browser using:
   `http://YOUR_IP:5173`

**Note**: Make sure your mobile device and computer are on the same network. Both server and client are configured to accept connections from network devices (0.0.0.0).

## Technologies Used

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, HTTP Server, Busboy (file upload), PDF-lib
- **Styling**: CSS3 with mobile-responsive design
- **Testing**: Jest, React Testing Library, Husky (git hooks)

## API Endpoints

### POST `/sign`

Uploads a PDF file for signing.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `pdf` field containing the PDF file

**Response**:
- Content-Type: `application/pdf`
- Body: Signed PDF file with a signature stamp added (includes "SIGNED" text, date, and "Mock Server" label)

## Testing

This project uses **Jest** for unit testing and **Husky** for git hooks to ensure code quality.

> 📖 **For detailed testing documentation, see [TESTING.md](./TESTING.md)**

### Running Tests

#### Run All Tests

From the root directory:
```bash
npm test
```

#### Run Client Tests Only

```bash
cd client
npm test
```

Or from root:
```bash
npm run test:client
```

#### Run Server Tests Only

```bash
cd server
npm test
```

Or from root:
```bash
npm run test:server
```

#### Watch Mode

Run tests in watch mode for development:
```bash
cd client
npm run test:watch
```

#### Coverage Reports

Generate coverage reports:
```bash
cd client
npm run test:coverage
```

Or for server:
```bash
cd server
npm run test:coverage
```

### Test Structure

#### Client Tests
- **Components**: All React components have test files in `__tests__` directories
- **Utils**: File validation and API utilities are tested
- **Hooks**: Custom hooks like `usePdfUpload` are tested
- **Test Location**: `client/src/**/__tests__/**/*.test.tsx`

#### Server Tests
- **PDF Processing**: Tests for PDF signing and stamping functionality
- **Server Utilities**: Tests for server-side logic
- **Test Location**: `server/__tests__/**/*.test.js`

### Git Hooks (Husky)

This project uses **Husky** to run tests automatically before commits:

- **Pre-commit Hook**: Automatically runs tests before allowing commits
- **Location**: `.husky/pre-commit`

To bypass hooks (not recommended):
```bash
git commit --no-verify
```

### Writing New Tests

When adding new features:

1. **Client**: Create test files in `__tests__` directories next to components
2. **Server**: Create test files in `server/__tests__/` directory
3. Follow existing test patterns and naming conventions
4. Ensure tests pass before committing (Husky will enforce this)

### Test Coverage Goals

- Aim for >80% code coverage
- Focus on critical business logic and user-facing features
- Test error handling and edge cases

## Development

### Building for Production

```bash
cd client
npm run build
```

The production build will be in the `client/dist` directory.

### Server Port

The server runs on port 5000 by default. To change it, modify `server/index.js`:

```javascript
server.listen(YOUR_PORT, () => {
  console.log("Server running on port YOUR_PORT");
});
```

## Notes

- This is a **mock signing server** - it adds a visual signature stamp to PDFs but doesn't add cryptographic digital signatures
- The server automatically adds a signature stamp with "SIGNED" text, date, and server label to every PDF
- The server simulates a 2-second processing delay to mimic real signing operations
- In a production environment, you would integrate with a real PDF signing service
- The server cleans up uploaded files after processing
- CORS is enabled to allow cross-origin requests
- Both server and client are configured to accept network connections for mobile testing


