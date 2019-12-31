cp README.md packages/client/
cp README.md packages/server/

yarn login

yarn workspace @node-rpc/client publish --access public
yarn workspace @node-rpc/server publish --access public
