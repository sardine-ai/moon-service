echo "Running Prisma Migrations..."
npx prisma migrate dev
echo "STARTING NPM SERVER!"
npm run dev -- self
