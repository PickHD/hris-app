CREATE TABLE IF NOT EXISTS loans (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  
  user_id BIGINT NOT NULL,
  employee_id BIGINT NOT NULL,
  approved_by BIGINT NULL,
  
  total_amount DECIMAL(15, 2) NOT NULL,
  installment_amount DECIMAL(15, 2) NOT NULL,
  remaining_amount DECIMAL(15,2) NOT NULL,
  reason TEXT NULL,
  
  status ENUM('PENDING', 'APPROVED', 'REJECTED','PAID_OFF') NOT NULL DEFAULT 'PENDING',
  rejection_reason TEXT NULL,
  
  INDEX idx_loans_user_id (user_id),
  INDEX idx_loans_status (status),

  CONSTRAINT fk_loans_user
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_loans_employee
      FOREIGN KEY (employee_id) REFERENCES employees(id)
      ON DELETE RESTRICT ON UPDATE CASCADE,
      
  CONSTRAINT fk_loans_approver
      FOREIGN KEY (approved_by) REFERENCES users(id)
      ON DELETE SET NULL ON UPDATE CASCADE
);