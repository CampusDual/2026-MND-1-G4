INSERT INTO distributor (name) VALUES ('SmartCafe Demo');

INSERT INTO store (distributor_id, name)
SELECT id, 'Centro' FROM distributor WHERE name = 'SmartCafe Demo';

INSERT INTO store (distributor_id, name)
SELECT id, 'Norte' FROM distributor WHERE name = 'SmartCafe Demo';

INSERT INTO waiter (distributor_id, store_id, name)
SELECT d.id, s.id, 'Ana'
FROM distributor d JOIN store s ON s.distributor_id = d.id
WHERE d.name = 'SmartCafe Demo' AND s.name = 'Centro';

INSERT INTO waiter (distributor_id, store_id, name)
SELECT d.id, s.id, 'Luis'
FROM distributor d JOIN store s ON s.distributor_id = d.id
WHERE d.name = 'SmartCafe Demo' AND s.name = 'Centro';

INSERT INTO waiter (distributor_id, store_id, name)
SELECT d.id, s.id, 'Marta'
FROM distributor d JOIN store s ON s.distributor_id = d.id
WHERE d.name = 'SmartCafe Demo' AND s.name = 'Centro';

INSERT INTO waiter (distributor_id, store_id, name)
SELECT d.id, s.id, 'Pablo'
FROM distributor d JOIN store s ON s.distributor_id = d.id
WHERE d.name = 'SmartCafe Demo' AND s.name = 'Norte';

INSERT INTO waiter (distributor_id, store_id, name)
SELECT d.id, s.id, 'Lucia'
FROM distributor d JOIN store s ON s.distributor_id = d.id
WHERE d.name = 'SmartCafe Demo' AND s.name = 'Norte';

INSERT INTO waiter (distributor_id, store_id, name)
SELECT d.id, s.id, 'Diego'
FROM distributor d JOIN store s ON s.distributor_id = d.id
WHERE d.name = 'SmartCafe Demo' AND s.name = 'Norte';

INSERT INTO manager_profile (distributor_id, user_id)
SELECT d.id, u.id
FROM distributor d CROSS JOIN users u
WHERE d.name = 'SmartCafe Demo' AND u.username = 'admin';
