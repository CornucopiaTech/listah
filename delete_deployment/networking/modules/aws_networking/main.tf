
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-vpc" : v)
  }
}

resource "aws_subnet" "public1" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  # tags = var.tags
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-public-subnet1" : v)
  }
}

resource "aws_subnet" "public2" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.2.0/24"
  # tags = var.tags
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-public-subnet2" : v)
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  # tags = var.tags
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-igw" : v)
  }
}

resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
  }
  # tags = var.tags
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-pub-rtb" : v)
  }
}

resource "aws_route_table_association" "public_rtb_ass" {
  subnet_id      = aws_subnet.public1.id
  route_table_id = aws_route_table.public_rtb.id
}
