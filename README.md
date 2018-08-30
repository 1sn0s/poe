# poe
This is a proof of existence application using the ethereum blockchain. You can upload a file (image or video) using ipfs, a decentralised storage protocol, and the ipfs hash ( content hash) of the file will be stored on the chain as a proof.
You can later use the hash and other reference data stored, to verify the proof of existence of the file during the time of upload.

The application uses ipfs for storage layer , ethereum for the trust layer and a single page web application, using angular framework, for the front end.

### Installation

#### Code repo
Get the code from [here](https://github.com/1sn0s/poe)

#### node dependecies
`npm install`

#### truffle cli
`sudo npm install -g truffle`

#### ganache-cli for local test network
`sudo npm install -g ganache-cli`

In Ubuntu 16.04, if the ng command opens the terminal text editor, you can use the command by either :
1 - setting the ng alias manually or
2 - removing the existing ng editor package by "sudo apt purge ng-common ng-latin"

#### install angular cli for running app locally
`sudo npm install -g @angular/cli`

#### Install zeppelin ethpm libraries using truffle
`truffle install zeppelin`

(This adds the Zeppelin library to an installed_contracts directory in the root using EthPM, similar to node_modules using NPM)

#### Run a local test network
`ganache-cli`

#### Run tests
`truffle test`
(Tests are located inside the test folder of the)

#### Deploy contracts to local test net
`truffle compile`
`truffle migrate`

#### running the application locally
`ng serve -o`
This would start serving the application on localhost:4200

You need have metamask enabled and unlocked in your browser and have it pointed to the corresponding network (localhost:8545 for ganache by default) to interact with the application.
If metamask is not enabled, the first account of the test net would be used as the default account. Also, no confirmations/options would be asked for making transactions in this case.

## Using the applications

Open the application URL served at localhost:4200 ( by running the ng serve )

There are currently three funcationalities for the application.
Upload a data (image/video) from current user account,
View all the data that was uploaded from the current user account
Verify a data for its proof of existence at a time period using it's reference data from the blockchain.

### Upload files
You can upload an image or a video from the upload screen of the application.
You can upload data by either dragging the files in, browsing the files or capture and upload from the camera (not tested)
Once you select files, they are uploaded to ipfs and the ipfs multihash along with other
reference data are stored on the proof of existence smart contract deployed in the current ethereum network.
The ipfs hash of the file is used as the proof/key on the chain. The ipfs hash is converted to a byte array of 32 bytes for storing on the chain. 
Currently the contract only supports SHA256 ipfs hashes, based on the bytes32 conversion mechanism.
The transaction id of the transaction that stores the proof data on the chain is also saved on the chain as a second transaction 
(You can cancel this transaction if you don't want to store the data)

### View files
On the user dashboard of the application, you can see the list of files that were
uploaded from your current account.
Initially a count of all files for current user is queried from the chain and then
each file data are pulled from the chain one by one.
From the dashboard, user can give tags for files that they have uploaded.
Selecting a file would open up a more detailed view of the file, with all the reference data.
The link of this page can be copied and shared for verification as well, since it pulls all the reference datas.

### Verify files
Using the verification feature, any ethereum account can verify a file by checking its reference data from the chain.
A file can be verified either by uploading the file or providing its hash.
You can upload a file, and the application will create the hash of the file and pull reference data
for the hash from the chain to verify.
Any account with the hash of the file can also verify the details by using the hash as well.
Verification can also be done, if the owner account of an uploaded file shares the link of the
detailed view of the file (as mentioned previous



### Other info
A LibraryDemo sol file is created at the root folder.
Other doc files are inside the doc folder
