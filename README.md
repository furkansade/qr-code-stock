# QR Kodlu Stok Takip Yazılımı

Bu proje, **Node.js** ve **Express** kullanarak QR kodlarla kolayca stok takibi yapmayı amaçlayan bir yazılımdır. Her ürün için QR kod oluşturularak stok bilgilerine hızlı erişim sağlanır ve stok giriş-çıkış işlemleri kaydedilir.

## Özellikler

- Her ürün için QR kod oluşturma
- Ürünlerin stok durumunu QR kod ile görüntüleme
- Stok giriş ve çıkış işlemlerini kaydetme
- Admin ve çalışan rolleri ile kullanıcı yetkilendirme

## Kurulum

1. Bu projeyi klonlayın:
   	```bash
  	 git clone https://github.com/furkansade/qr-code-stock-tracking.git
	```

2. Proje dizinine gidin:
	```bash
	cd qr-code-stock-tracking
	```

3. Gerekli paketleri yükleyin:
	```bash
	npm install
	```

4. `.env` dosyasında PORT numarasını belirleyin:
	```plaintext
	PORT=3000
    ```

5. Nodemon ile projeyi çalıştırın:
	```bash
	npm run dev
	```

## Kullanılan Teknolojiler
	
- Node.js
- Express
- MongoDB (Mongoose)
- QR Code
- JWT (JSON Web Token) ile kimlik doğrulama
- Cloudinary (QR kodları saklamak için)
