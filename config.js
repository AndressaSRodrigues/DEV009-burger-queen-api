exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.MONGO_URL || process.env.DB_URL || 'mongodb+srv://andressa:juanjose2207@cluster0.qnqjola.mongodb.net/?retryWrites=true&w=majority';
exports.secret = process.env.JWT_SECRET || 'B77B958B86C7BC9FFAEAEB219B288FA4E341E4A72D1D403E3633A3323015DD35';
exports.adminEmail = process.env.ADMIN_EMAIL || 'andressa@bq.com';
exports.adminPassword = process.env.ADMIN_PASSWORD || '123456';

/*
Generate key in powershell:
Add-Type -AssemblyName System.Security
>>
>> $randomBytes = New-Object byte[] 32
>> [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($randomBytes)
>> $secretKey = [BitConverter]::ToString($randomBytes) -replace '-'
>>
>> $secretKey
*/
