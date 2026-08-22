variable "project_name" {
  description = "Project name used for AWS resource naming"
  type        = string
  default     = "aws-three-tier-devops"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "container_port" {
  description = "Application container port"
  type        = number
  default     = 3000
}

variable "db_port" {
  description = "MySQL database port"
  type        = number
  default     = 3306
}
variable "db_password" {
  description = "Master password for the MySQL database"
  type        = string
  sensitive   = true
}
