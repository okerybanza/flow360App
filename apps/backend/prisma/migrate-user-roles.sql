-- Migration script to update user roles to match current schema
-- This script maps old roles to new roles

-- Update users with old roles to ARCHITECT role (most appropriate for project management)
UPDATE users 
SET role = 'ARCHITECT' 
WHERE role IN (
  'PROJECT_MANAGER',
  'SITE_SUPERVISOR', 
  'SAFETY_OFFICER',
  'QUALITY_INSPECTOR',
  'EQUIPMENT_MANAGER',
  'SUBCONTRACTOR_COORDINATOR',
  'FIELD_WORKER'
);

-- Verify the update
SELECT role, COUNT(*) FROM users GROUP BY role;
