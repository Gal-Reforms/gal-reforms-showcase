-- Confirmar email manualmente para desenvolvimento
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = 'dw12021996@gmail.com';