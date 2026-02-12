
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-vpc" : v)
  }
}

resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.0.0/20"
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-private-subnet" : v)
  }
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.16.0/20"
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-public-subnet" : v)
  }
}

# resource "aws_internet_gateway" "gw" {
#   vpc_id = aws_vpc.main.id
#   tags = {
#     for k, v in var.tags : k => (k == "Name" ? "${v}-igw" : v)
#   }
# }

resource "aws_route_table" "private_rtb" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
  }
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-private-rtb" : v)
  }
}

resource "aws_route_table_association" "private_rtb_ass" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private_rtb.id
}



resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.main.id

  # route {
  #   cidr_block = "0.0.0.0/0"
  #   gateway_id = aws_internet_gateway.gw.id
  # }
  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
  }
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-public-rtb" : v)
  }
}

resource "aws_route_table_association" "public_rtb_ass" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rtb.id
}
