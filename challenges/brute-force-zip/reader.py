def main():

	with open('secret.txt', 'r') as f:
		secret = f.read().strip('\n')

	print("secret =", secret)

if __name__ == '__main__':
	main()
