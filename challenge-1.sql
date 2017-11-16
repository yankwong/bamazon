-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS `bamazon`;
-- Create a database called programming_db --
CREATE DATABASE `bamazon`;

USE `bamazon`;

CREATE TABLE `products` (
	`item_id` INT NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(255) NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) DEFAULT 0,
    `stock_quantity` INT DEFAULT 0,
    PRIMARY KEY (`item_id`)
);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES 
('Overwatch', 'game', 59.99, 10),
('Witcher 3', 'game', 44.85, 8),
('Dragon Ball Xenoverse 2', 'game', 39.61, 4),
('Nier Automata', 'game', 39.99, 15),
('Horizon Zero Dawn', 'game', 38.90, 12),
('Ys VIII: Lacrimosa of Dana', 'game', 59.96, 9),
('Fortnite', 'game', 59.88, 5),
('Disgaea 5: Alliance of Vengeance', 'game', 44.18, 3),
('Resident Evil 6', 'game', 19.74, 6),
('Yakuza 0', 'game', 59.90, 2);
